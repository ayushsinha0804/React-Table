import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';

export default function BasicTable({ data, columns }) {
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState('');
  const [fade, setFade] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnFilters, setColumnFilters] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: sorting,
      globalFilter: filtering,
      columnVisibility: columnVisibility,
      columnFilters: columnFilters,
    },
    onSortingChange: (newSorting) => handleSortingChange(newSorting),
    onGlobalFilterChange: setFiltering,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
  });

  const pageNumbers = [...Array(table.getPageCount()).keys()];

  const handlePageChange = (pageIndex) => {
    setFade(false);
    setTimeout(() => {
      table.setPageIndex(pageIndex);
      setFade(true);
    }, 200);
  };

  const handleSortingChange = (newSorting) => {
    setFade(false);
    setTimeout(() => {
      setSorting(newSorting);
      setFade(true);
    }, 200);
  };

  const handleColumnToggle = (columnId) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };

  const handleFilterChange = (columnId, value) => {
    setColumnFilters((prev) => ({
      ...prev,
      [columnId]: value,
    }));
  };

  useEffect(() => {
    setFade(true);
  }, []);

  return (
    <div className="w3-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search"
          value={filtering}
          onChange={(e) => setFiltering(e.target.value)}
        />
        {filtering && (
          <button className="clear-button" onClick={() => setFiltering('')}>
            ✖
          </button>
        )}
        <button className="sidebar-toggle-button" onClick={() => setSidebarOpen(!sidebarOpen)}>
          ⚙️
        </button>
        <button className="filter-sidebar-toggle-button" onClick={() => setFilterSidebarOpen(!filterSidebarOpen)}>
        🔧
        </button>
      </div>
      {sidebarOpen && (
        <div className="sidebar">
          <div className="sidebar-header">
            <h3>Show/Hide Columns</h3>
            <button className="close-button" onClick={() => setSidebarOpen(false)}>✖</button>
          </div>
          <div className="sidebar-content">
            {table.getAllColumns().map(column => (
              <div key={column.id} className="sidebar-item">
                <label>{column.id}</label>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={column.getIsVisible()}
                    onChange={() => handleColumnToggle(column.id)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            ))}
          </div>
          <div className="sidebar-footer">
            <button className="show-all-button" onClick={() => setColumnVisibility({})}>
              Show all columns
            </button>
            <button className="apply-button" onClick={() => setSidebarOpen(false)}>Apply</button>
          </div>
        </div>
      )}
      {filterSidebarOpen && (
        <div className="filter-sidebar">
          <div className="filter-sidebar-header">
            <h3>Filters</h3>
            <button className="close-button" onClick={() => setFilterSidebarOpen(false)}>✖</button>
          </div>
          <div className="filter-sidebar-content">
            {table.getAllColumns().map(column => (
              <div key={column.id} className="filter-sidebar-item">
                <label>{column.id}</label>
                <input
                  type="text"
                  value={columnFilters[column.id] ?? ''}
                  onChange={(e) => handleFilterChange(column.id, e.target.value)}
                />
              </div>
            ))}
          </div>
          <div className="filter-sidebar-footer">
            <button className="clear-filters-button" onClick={() => setColumnFilters({})}>
              Clear Filters
            </button>
          </div>
        </div>
      )}
      <div className={`table-container ${fade ? 'table-fade-active' : 'table-fade'}`}>
        <table className="w3-table-all">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <i className="fa-solid fa-sort"></i>
                        {{ asc: '🔼', desc: '🔽' }[header.column.getIsSorted() ?? null]}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        {pageNumbers.map(pageNumber => (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            disabled={table.getState().pagination.pageIndex === pageNumber}
            className={table.getState().pagination.pageIndex === pageNumber ? 'active' : ''}
          >
            {pageNumber + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
