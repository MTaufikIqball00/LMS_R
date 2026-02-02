import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  children?: React.ReactNode; // To allow for optional right-side content like stats
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">{title}</h1>
            <p className="text-sky-100 text-lg">{subtitle}</p>
          </div>
          {children && (
            <div className="hidden md:flex items-center space-x-3">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;