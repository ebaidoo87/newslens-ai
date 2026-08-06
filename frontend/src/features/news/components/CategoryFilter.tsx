interface CategoryFilterProps {
  value: string;
  onChange: (category: string) => void;
}

const categories = [
  { label: "All", value: "all" },
  { label: "Technology", value: "technology" },
  { label: "Business", value: "business" },
  { label: "Money", value: "money" },
  { label: "Sports", value: "sports" },
  { label: "Science", value: "science" },
  { label: "Health", value: "health" },
  { label: "Food", value: "food" },
  { label: "Lifestyle", value: "lifestyle" },
  {
    label: "Entertainment",
    value: "entertainment",
  },
  { label: "General", value: "general" },
];

export default function CategoryFilter({
  value,
  onChange,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((category) => {
        const isActive =
          value === category.value;

        return (
          <button
            key={category.value}
            type="button"
            onClick={() =>
              onChange(category.value)
            }
            className={`
              rounded-full
              border
              px-4
              py-2
              text-sm
              font-medium
              transition
              ${
                isActive
                  ? "border-blue-500 bg-blue-600 text-white"
                  : "border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-500 hover:text-white"
              }
            `}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
}