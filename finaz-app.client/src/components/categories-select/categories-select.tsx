import React from "react";

import { useFetchCategories } from "@hooks";

import { SelectField } from "../select-field";

export interface ICategoriesSelectProps {
  name: string;
}

const CategoriesSelect = ({ name }: ICategoriesSelectProps) => {
  const categories = useFetchCategories();

  const categoriesOptions = React.useMemo(() => {
    if (!categories.data?.length) return [];
    return categories.data.map((category) => ({
      label: category.nombre,
      value: category.categoriaId,
      disabled: category.isDeleted,
    }));
  }, [categories.data]);

  return (
    <SelectField
      name={name}
      label="Categoría"
      items={categoriesOptions}
      placeholder="Selecciona una categoría"
    />
  );
};

export default CategoriesSelect;
