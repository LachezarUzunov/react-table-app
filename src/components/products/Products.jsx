import { useEffect, useMemo, useState } from "react";
import axios from 'axios';
import { useTable } from 'react-table'

export function Products() {
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        const response = await axios.get('https://fakestoreapi.com/products').catch(err => console.log(err));

        if (response) {
            const products = response.data;

            console.log('Products', products);
            setProducts(products);
        }
    }

    const productsData = useMemo(() => [...products], [products])
    const productColumns = useMemo(
        () => 
            products[0] 
                ? Object.keys(products[0])
                .filter(key => key !== 'rating')
                .map(key => {
        return (
            { Header: key, accessor: key }
        )}) : [], [products])

    const tableInstance = useTable({ columns: productColumns, data: productsData })

    const { 
        getTableProps, 
        getTableBodyProps, 
        headerGroups, 
        rows,
        prepareRow
    } = tableInstance;

    useEffect(() => {
        fetchProducts();
    }, [])

    return (
        <table {...getTableProps()}>
            <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <th {...column.getHeaderProps()}>
                                {column.render('Header')}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                    prepareRow(row);
                    return (
                    <tr {...row.getRowProps()}>
                        { row.cells.map((cell, idx) => (
                            <td {...cell.getCellProps()}>{ cell.render("Cell") }</td>
                        ))}
                    </tr>
                )})}
            </tbody>
        </table>
    )
}