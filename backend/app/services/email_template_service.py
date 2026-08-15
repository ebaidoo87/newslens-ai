from html import escape

from app.models.notification import Notification


class EmailTemplateService:

    @staticmethod
    def build_digest_text(
        notifications: list[Notification],
        digest_type: str,
    ) -> str:
        label = (
            "Daily"
            if digest_type == "daily_digest"
            else "Weekly"
        )

        lines = [
            "NewsLens AI",
            "",
            f"{label} News Digest",
            "",
            (
                f"You have {len(notifications)} "
                "new matching stories."
            ),
            "",
        ]

        for index, notification in enumerate(
            notifications,
            start=1,
        ):
            article = notification.article

            lines.extend(
                [
                    f"{index}. {article.title}",
                    f"Source: {article.source}",
                    f"Category: {article.category}",
                    f"Read: {article.url}",
                    "",
                ]
            )

        lines.extend(
            [
                "NewsLens AI",
                (
                    "Personalized news based on "
                    "your saved interests."
                ),
            ]
        )

        return "\n".join(lines)

    @staticmethod
    def build_article_card(
        notification: Notification,
    ) -> str:
        article = notification.article

        title = escape(
            article.title or "Untitled article"
        )

        source = escape(
            article.source or "Unknown source"
        )

        category = escape(
            article.category or "general"
        ).title()

        summary = escape(
            article.summary or ""
        )

        url = escape(
            article.url or "#",
            quote=True,
        )

        image_url = (
            escape(
                article.image_url,
                quote=True,
            )
            if article.image_url
            else None
        )

        image_html = ""

        if image_url:
            image_html = f"""
                <a
                    href="{url}"
                    style="
                        display:block;
                        text-decoration:none;
                    "
                >
                    <img
                        src="{image_url}"
                        alt="{title}"
                        width="100%"
                        style="
                            display:block;
                            width:100%;
                            max-height:260px;
                            object-fit:cover;
                            border-radius:12px 12px 0 0;
                        "
                    />
                </a>
            """

        summary_html = ""

        if summary:
            summary_html = f"""
                <p style="
                    margin:12px 0 0;
                    color:#9ca3af;
                    font-size:15px;
                    line-height:1.6;
                ">
                    {summary}
                </p>
            """

        return f"""
            <div style="
                margin-bottom:24px;
                border:1px solid #1f2937;
                border-radius:12px;
                overflow:hidden;
                background:#111827;
            ">
                {image_html}

                <div style="padding:20px;">
                    <div style="
                        margin-bottom:10px;
                        font-size:13px;
                        color:#60a5fa;
                        font-weight:600;
                    ">
                        {source} · {category}
                    </div>

                    <h2 style="
                        margin:0;
                        color:#ffffff;
                        font-size:21px;
                        line-height:1.35;
                    ">
                        {title}
                    </h2>

                    {summary_html}

                    <div style="margin-top:18px;">
                        <a
                            href="{url}"
                            style="
                                display:inline-block;
                                padding:11px 18px;
                                border-radius:8px;
                                background:#2563eb;
                                color:#ffffff;
                                text-decoration:none;
                                font-size:14px;
                                font-weight:600;
                            "
                        >
                            Read article →
                        </a>
                    </div>
                </div>
            </div>
        """

    def build_digest_html(
        self,
        notifications: list[Notification],
        digest_type: str,
    ) -> str:
        label = (
            "Daily"
            if digest_type == "daily_digest"
            else "Weekly"
        )

        article_cards = "".join(
            self.build_article_card(
                notification
            )
            for notification in notifications
        )

        return f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    />
    <title>NewsLens {label} Digest</title>
</head>

<body style="
    margin:0;
    padding:0;
    background:#030712;
    font-family:
        Arial,
        Helvetica,
        sans-serif;
">

    <div style="
        width:100%;
        padding:32px 16px;
        box-sizing:border-box;
    ">

        <div style="
            max-width:680px;
            margin:0 auto;
        ">

            <div style="
                margin-bottom:28px;
                text-align:center;
            ">
                <h1 style="
                    margin:0;
                    color:#ffffff;
                    font-size:30px;
                ">
                    NewsLens AI
                </h1>

                <p style="
                    margin:8px 0 0;
                    color:#60a5fa;
                    font-size:14px;
                    font-weight:600;
                    letter-spacing:0.4px;
                ">
                    YOUR {label.upper()} NEWS DIGEST
                </p>
            </div>


            <div style="
                margin-bottom:24px;
                padding:24px;
                border:1px solid #1f2937;
                border-radius:12px;
                background:#111827;
            ">
                <h2 style="
                    margin:0;
                    color:#ffffff;
                    font-size:24px;
                ">
                    Stories picked for you
                </h2>

                <p style="
                    margin:10px 0 0;
                    color:#9ca3af;
                    line-height:1.6;
                ">
                    We found
                    <strong style="color:#ffffff;">
                        {len(notifications)}
                    </strong>
                    new stories matching your
                    NewsLens preferences.
                </p>
            </div>


            {article_cards}


            <div style="
                padding:24px 0;
                text-align:center;
                color:#6b7280;
                font-size:13px;
                line-height:1.6;
            ">
                <p style="margin:0;">
                    NewsLens AI
                </p>

                <p style="margin:6px 0 0;">
                    Personalized news based on
                    your saved interests.
                </p>

                <p style="margin:6px 0 0;">
                    You can change your email
                    preferences anytime from
                    NewsLens Settings.
                </p>
            </div>

        </div>
    </div>

</body>
</html>
"""