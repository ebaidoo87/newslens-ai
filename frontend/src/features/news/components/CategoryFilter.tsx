const categories = [
  "all",
  "technology",
  "business",
  "science",
  "sports",
];

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function CategoryFilter({
  value,
  onChange,
}: Props) {
    
  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          className={`rounded-full px-4 py-2 transition ${
            value === category
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}