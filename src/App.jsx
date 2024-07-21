import { DateTime } from 'luxon'
import { useMemo } from 'react'
import './App.css'
import datam from './data.json'
import BasicTable from './components/ReactTable'

function App() {
  const data = useMemo(() => datam, [])

  /** @type import('@tanstack/react-table').ColumnDef<any> */

  const movieColumns = [
    {
      header: 'ID',
      accessorKey: 'id',
    },
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Category',
      accessorKey: 'category',
    },
    {
      header: 'Sub Category',
      accessorKey: 'subcategory',
    },
    {
      header: 'Created At',
      accessorKey: 'createdAt',
      cell: info =>
        DateTime.fromISO(info.getValue()).toLocaleString(DateTime.DATE_MED)
    },
    {
      header: 'Updated At',
      accessorKey: 'updatedAt',
      cell: info =>
        DateTime.fromISO(info.getValue()).toLocaleString(DateTime.DATE_MED)
    },
    {
      header: 'Price',
      accessorKey: 'price',
    },
    {
      header: 'Sale Price',
      accessorKey: 'sale_price'
    }

  ]

  return (
    <>
      
      <BasicTable data={data} columns={movieColumns} />
    </>
  )
}

export default App