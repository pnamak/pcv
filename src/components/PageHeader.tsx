interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-6 sm:mb-8">
      <h1 className="text-2xl font-bold text-pcv-burgundy sm:text-3xl">
        {title}
      </h1>
      {description && (
        <p className="mt-2 text-sm text-gray-600 sm:text-base">{description}</p>
      )}
    </div>
  );
}
