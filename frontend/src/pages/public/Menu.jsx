import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSeo } from '../../hooks/useSeo';
import PageHero from '../../components/common/PageHero';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import MenuItemCard from '../../components/menu/MenuItemCard';
import Reveal from '../../components/common/Reveal';
import Pagination from '../../components/common/Pagination';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/States';
import { PrimaryButton } from '../../components/common/Buttons';
import { getMenuCategories, getMenuItems } from '../../services/publicApi';
import { useQuoteSelection } from '../../context/QuoteSelectionContext';

const DIET_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'veg', label: 'Vegetarian' },
  { value: 'non-veg', label: 'Non-Vegetarian' },
  { value: 'jain', label: 'Jain' },
  { value: 'vegan', label: 'Vegan' },
];

const PAGE_SIZE = 30;

export default function Menu() {
  useSeo({ title: 'Menu | Shree Sanware Sarkar Caters and Supervision', description: 'Browse our searchable, filterable catering menu.' });

  const navigate = useNavigate();
  const { selectedItems, toggleItem } = useQuoteSelection();

  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [diet, setDiet] = useState('');
  const [page, setPage] = useState(1);

  const [items, setItems] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [error, setError] = useState(null);

  // With 900+ dishes across 30 categories, showing every dish at once isn't
  // browsable. Land on a category directory; only fetch the full item list
  // once the person picks a category, searches, or filters by diet.
  const isBrowsingCategories = !category && !search && !diet;

  useEffect(() => {
    getMenuCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    if (isBrowsingCategories) {
      setItems(null);
      setPagination(null);
      return;
    }
    setItems(null);
    setError(null);
    const params = { page, limit: PAGE_SIZE };
    if (search) params.search = search;
    if (category) params.category = category;
    if (diet) params.diet = diet;

    getMenuItems(params)
      .then((res) => {
        setItems(res.data);
        setPagination(res.pagination);
      })
      .catch(() => setError('Unable to load the menu right now.'));
  }, [search, category, diet, page, isBrowsingCategories]);

  function handleSendPreferences() {
    navigate('/get-a-quote');
  }

  function selectCategory(slug) {
    setCategory(slug);
    setPage(1);
  }

  function clearFilters() {
    setCategory('');
    setSearch('');
    setDiet('');
    setPage(1);
  }

  const activeCategoryName = categories.find((c) => c.slug === category)?.name;

  return (
    <>
      <PageHero eyebrow="Our Menu" title="Explore Our Catering Menu" description="Browse by category, or search our full catalog." />
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Menu' }]} />

      <section className="container-page py-10">
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <input
            type="search"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search dishes..."
            aria-label="Search dishes"
            className="flex-1 border border-border-beige px-4 py-2.5 bg-white"
          />
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            aria-label="Filter by category"
            className="border border-border-beige px-4 py-2.5 bg-white"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c.slug}>{c.name}</option>
            ))}
          </select>
          <select
            value={diet}
            onChange={(e) => { setDiet(e.target.value); setPage(1); }}
            aria-label="Filter by dietary preference"
            className="border border-border-beige px-4 py-2.5 bg-white"
          >
            {DIET_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {isBrowsingCategories && (
          <>
            {categories.length === 0 ? (
              <LoadingState label="Loading categories..." />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {categories.map((c, idx) => (
                  <Reveal key={c._id} delay={(idx % 9) * 60}>
                    <button
                      type="button"
                      onClick={() => selectCategory(c.slug)}
                      className="w-full text-left bg-white border border-border-beige p-6 hover:border-gold transition-colors group"
                    >
                      <h3 className="font-display text-xl text-espresso group-hover:text-maroon transition-colors">
                        {c.name}
                      </h3>
                      <p className="text-sm text-brown-muted mt-1">
                        {c.itemCount} {c.itemCount === 1 ? 'dish' : 'dishes'}
                      </p>
                    </button>
                  </Reveal>
                ))}
              </div>
            )}
          </>
        )}

        {!isBrowsingCategories && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <p className="text-sm text-brown-muted">
                {activeCategoryName ? (
                  <>Showing <span className="text-espresso font-medium">{activeCategoryName}</span></>
                ) : (
                  'Showing search results'
                )}
                {pagination && <> &middot; {pagination.total} {pagination.total === 1 ? 'dish' : 'dishes'}</>}
              </p>
              <button type="button" onClick={clearFilters} className="text-sm font-semibold text-gold hover:underline">
                ← Back to all categories
              </button>
            </div>

            {error && <ErrorState message={error} />}
            {!error && !items && <LoadingState label="Loading menu..." />}
            {items && items.length === 0 && <EmptyState title="No dishes match your filters" />}
            {items && items.length > 0 && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {items.map((item, idx) => (
                    <Reveal key={item._id} delay={(idx % 10) * 40}>
                      <MenuItemCard
                        item={item}
                        selected={selectedItems.some((i) => i.refId === item._id)}
                        onToggleSelect={(i) => toggleItem({ refId: i._id, name: i.name, type: 'menuItem' })}
                      />
                    </Reveal>
                  ))}
                </div>

                <Pagination page={page} totalPages={pagination?.totalPages} onChange={setPage} />
              </>
            )}
          </>
        )}

        {selectedItems.length > 0 && (
          <div className="fixed bottom-6 inset-x-0 flex justify-center z-40 px-4 pointer-events-none">
            <div className="wine-surface text-ivory px-6 py-4 flex flex-wrap items-center gap-4 shadow-2xl pointer-events-auto animate-fade-up">
              <span className="text-sm">{selectedItems.length} dish(es) selected</span>
              <PrimaryButton onClick={handleSendPreferences} className="btn-gold">
                Send My Menu Preferences
              </PrimaryButton>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
