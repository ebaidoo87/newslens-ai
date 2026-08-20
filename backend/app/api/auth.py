
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
    status,
)
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.db.session import get_db
from app.schemas.token import Token
from app.schemas.user import (
    UserLogin,
    UserRegister,
    UserResponse,
)
from app.services.auth_service import AuthService

from app.models.user import User

from app.schemas.user import (
    UserLogin,
    UserRegister,
    UserResponse,
    UserUpdate,
)

from app.schemas.user import (
    PasswordChange,
    UserLogin,
    UserRegister,
    UserResponse,
    UserUpdate,
)

from fastapi import Request

from app.core.rate_limit import (
    limiter,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/auth/login",
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=(
        status.HTTP_201_CREATED
    ),
)
@limiter.limit("5/minute")
def register_user(
    request: Request,
    user_data: UserRegister,
    db: Session = Depends(get_db),
):
    service = AuthService(db)

    try:
        return service.register(
            user_data
        )

    except ValueError as error:
        raise HTTPException(
            status_code=(
                status.HTTP_409_CONFLICT
            ),
            detail=str(error),
        ) from error


@router.post(
    "/login",
    response_model=Token,
)
@limiter.limit("10/minute")
def login_user(
    request: Request,
    credentials: UserLogin,
    db: Session = Depends(get_db),
):
    service = AuthService(db)

    try:
        return service.login(
            credentials
        )

    except ValueError as error:
        raise HTTPException(
            status_code=(
                status.HTTP_401_UNAUTHORIZED
            ),
            detail=str(error),
            headers={
                "WWW-Authenticate":
                    "Bearer",
            },
        ) from error


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired authentication token",
        headers={
            "WWW-Authenticate": "Bearer",
        },
    )

    payload = decode_access_token(token)

    if not payload:
        raise credentials_error

    
    user_id = payload.get("user_id")
    token_version = payload.get(
        "token_version"
    )

    if user_id is None:
        raise credentials_error

    if token_version is None:
        raise credentials_error

    service = AuthService(db)

    user = service.get_current_user_by_id(
        user_id
    )

    if not user:
        raise credentials_error

    if user.token_version != token_version:
            raise credentials_error
    
    return user

    


@router.get(
    "/me",
    response_model=UserResponse,
)
def read_current_user(
    current_user: User = Depends(get_current_user),
):
    return current_user


@router.patch(
    "/me",
    response_model=UserResponse,
)
def update_current_user(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = AuthService(db)

    try:
        return service.update_profile(
            current_user,
            user_data,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        ) from error


@router.patch(
    "/password",
    status_code=status.HTTP_204_NO_CONTENT,
)
@limiter.limit("5/minute")
def change_current_user_password(
    request: Request,
    password_data: PasswordChange,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    service = AuthService(db)

    try:
        service.change_password(
            current_user,
            password_data,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        ) from error

    return None

@router.post(
    "/logout-all",
    status_code=status.HTTP_204_NO_CONTENT,
)
@limiter.limit("5/minute")
def logout_from_all_devices(
    request: Request,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    service = AuthService(db)

    service.revoke_all_sessions(
        current_user
    )

    return None