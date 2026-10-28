//components
import { Slider } from "../../../components/ui/slider";

export const maximumBudget = 1000000;

function formatBudget(value) {
  return new Intl.NumberFormat("en-SG", { style: "currency", currency: "SGD", maximumFractionDigits: 0 }).format(value);
}

function DesignFilters({ values, budgetRange, categories, categoriesLoading, categoriesFailed, onChange, onBudgetChange, onReset, onRetryCategories, canReset }) {
  return (
    <div aria-label="Filter interior designs" className="flex flex-wrap items-center gap-4 border-b border-sage-200/60 py-6">
      <div className="w-full sm:w-44">
        <label htmlFor="interior-design-property" className="sr-only">Property type</label>
        <select id="interior-design-property" name="property_type" value={values.property_type} onChange={onChange} className="auth-input font-medium text-sage-700">
          <option value="">Property type</option>
          {["HDB", "Condo", "Landed"].map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
      </div>
      <div className="w-full sm:w-48">
        <label htmlFor="interior-design-category" className="sr-only">Category</label>
        <select id="interior-design-category" name="category_type" value={values.category_type} onChange={onChange} disabled={categoriesLoading || categoriesFailed} className="auth-input font-medium text-sage-700 disabled:opacity-50">
          <option value="">{categoriesLoading ? "Loading categories..." : "Category"}</option>
          {categories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}
        </select>
        {categoriesFailed && <button type="button" onClick={onRetryCategories} className="mt-2 text-sm font-semibold text-sage-700 underline">Retry categories</button>}
      </div>
      <div className="w-full rounded-xl bg-sage-50 px-5 py-3 sm:ml-auto sm:w-80">
        <div className="mb-2 flex items-center justify-between gap-3 text-xs">
          <p className="font-semibold text-sage-700">Budget</p>
          <p className="text-ink/70">{formatBudget(budgetRange[0])} – {budgetRange[1] === maximumBudget ? "No maximum" : formatBudget(budgetRange[1])}</p>
        </div>
        <Slider min={0} max={maximumBudget} step={1000} value={budgetRange} onValueChange={onBudgetChange} thumbLabels={["Minimum budget", "Maximum budget"]} getValueLabel={(value, index) => index === 1 && value === maximumBudget ? "No maximum" : formatBudget(value)} />
      </div>
      {canReset && <button type="button" onClick={onReset} className="text-sm font-semibold text-sage-700 underline">Reset filters</button>}
    </div>
  );
}

export default DesignFilters;
