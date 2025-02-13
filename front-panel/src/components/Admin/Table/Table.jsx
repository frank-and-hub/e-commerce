import React, { useContext, useEffect, useState } from 'react'
import Button from './Button'
import { debounce, formattedData, truncateString, ucwords } from '../../../utils/helper'
import { Link } from 'react-router-dom'
import Pageignation from './Pageignation'
import ReusableModal from './Models/ReusableModal'
import { notifyError, notifySuccess } from '../Comman/Notification/Notification'
import { destroy, get, patch } from '../../../utils/AxiosUtils'
import { SidebarContext } from '../../../context/SidebarContext'
import { useLoading } from '../../../context/LoadingContext'
import { Loading } from '../Loading/Loading'

// Sample data
const Table = ({
    url,
    handelDelete = false,
    handelFilter = null,
    handelCreate = false,
    handelView = false,
    handelEdit = false,
    filter,
    moduleName
}) => {

    const { pathname } = useContext(SidebarContext);
    const { loading, setLoading } = useLoading();

    const [data, setData] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    // const [itemsPerPage] = useState(config.pageignation);

    const [dataCount, setDataCount] = useState(0);
    const [dataLimit, setDataLimit] = useState(0);

    const [modalDeleteShow, setModalDeleteShow] = useState(false);
    const [modalStatusShow, setModalStatusShow] = useState(false);

    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedItemName, setSelectedItemName] = useState(null);
    const [selectedItemStatus, setSelectedItemStatus] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'desc' });

    const title = `${ucwords(pathname + ' data table')}`;
    const cleanedTitle = title.replace(/[?_~/-]/g, ' ');

    const handleSearchChange = (e) => {
        debounce(setSearchTerm(e?.target?.value), 5000);
        setCurrentPage(1);
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    const headers = (data && data?.length > 0) ? Object.keys(data[0]) : [];

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    }

    const handleDeleteConfirm = async () => {
        setLoading(true)
        try {
            const resDeleted = await destroy(`/${moduleName}/${selectedItem}`);
            notifySuccess(resDeleted.message);
        } catch (err) {
            console.error(err.message);
        } finally {
            setLoading(false)
        }
        setModalDeleteShow(false);
        setSelectedItem(null);
    };

    const handleStatusChangeConfirm = async () => {
        setLoading(true)
        try {
            const newValues = formattedData({ 'status': selectedItemStatus });
            const resUpdated = await patch(`/${moduleName}/${selectedItem}`, newValues);
            notifySuccess(resUpdated.message);
        } catch (err) {
            console.error(err.message);
        } finally {
            setLoading(false)
        }
        setModalStatusShow(false);
        setSelectedItem(null);
    };

    const params = new URLSearchParams({
        ...filter,
        search: (searchTerm.length > 3) ? searchTerm : '',
        page: currentPage,
        orderby: sortConfig?.key ?? '_id',
        direction: sortConfig?.direction
    }).toString();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const res = await get(`${url}?${params}`);

                setData(res?.response?.data)
                setDataLimit(res?.response?.limit)
                setDataCount(res?.response?.count)
                setTotalPages(res?.response?.totalPages)
                setLoading(false)

            } catch (err) {
                notifyError(err.message || 'An error occurred while fetching data.');
            } finally {
                setLoading(false)
            }
        };

        if (!selectedItem) {
            fetchData();
        }

    }, [setLoading, url, selectedItem, params]);

    const handelDeleteModel = (e) => {
        setSelectedItem(e);
        setModalDeleteShow(true);
    }

    const handelStatusModel = (e) => {
        setSelectedItem(e);
        setModalStatusShow(true);
    }

    const longTextString = (item) => {
        if (Array.isArray(item)) {
            return item?.map((obj, idx) => ucwords(obj?.name)).join(', ');
        } else {
            return ucwords(item?.name);
        }
    }

    const start = (currentPage - 1) * dataLimit + 1;
    const end = Math.min(dataCount, currentPage * dataLimit);

    const columnCondication = (header, item, i) => {
        let content;
        switch (header) {
            case 'id':
                content = i + 1;
                break;
            case 'icon':
                content = <i className={item}></i>;
                break;
            case 'status':
                const btn = (<Button
                    iconClass={`bi bi-toggle-${(item === true) ? 'on' : 'off'}`}
                    onClick={(e) => {
                        handelStatusModel(item.id);
                        setSelectedItemName(item?.name);
                        setSelectedItemStatus(!item?.status);
                    }}
                    tooltip={`${(item === true) ? 'Active' : 'Inictive'}`}
                    disabled={!item}
                />);
                content = btn;
                break;
            case 'image':
                const imageSrc = item?.path;
                content = <div className={`w-25 rounded-25`} ><img src={`${imageSrc}`} className={`rounded-circle circle-image-small`} alt={`#`} /></div>;
                break;
            default:
                if (typeof item === 'object' && item !== null) {
                    content = truncateString(longTextString(item));
                } else {
                    content = truncateString(item);
                }
                break;
        }
        return content;
    }

    return (
        <>
            <div key={`${url}`} className='card'>
                <div className='card-body'>
                    <div className='row my-2'>
                        <div className='col-md-6'>
                            <h5 className="card-title text-capitalize">{(cleanedTitle)}</h5>
                        </div>
                        <div className="d-flex justify-content-evenly align-items-center col-md-6">
                            <div className="col-md-9 col-sm-10">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="form-control rounded-pill"
                                />
                            </div>
                            {handelFilter || handelCreate ? (
                                <div className="col-md-3 col-sm-2 d-flex justify-content-evenly" >
                                    {handelFilter && (
                                        <div className="col-6 m-auto">
                                            <span className="d-inline-block color" tabIndex="0" data-toggle="tooltip" title={ucwords(`Filter`)}>
                                                <Link onClick={() => handelFilter()} className={`btn btn-sm border rounded-circle`}>
                                                    <i className={`bi bi-filter`}></i>
                                                </Link>
                                            </span>
                                        </div>
                                    )}
                                    {handelCreate && (
                                        <div className="col-6 m-auto">
                                            <span className="d-inline-block color" tabIndex="0" data-toggle="tooltip" title={ucwords(`Add`)}>
                                                <Link to={`/admin${pathname}/create`} className={`btn btn-sm border rounded-circle`}>
                                                    <i className={`bi bi-plus`}></i>
                                                </Link>
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ) : ''}
                        </div>
                    </div>
                    <div>
                        <table className={`table table-borderless table-sm datatable table-responsive{-sm|-md|-lg|-xl}`}>
                            <thead>
                                <tr>
                                    {!loading && headers.length > 0 && (
                                        <>
                                            {headers.map((header, index) => (
                                                <th key={index} scope="row" className='text-capitalize' style={{ cursor: (header !== ('id' || '_id')) ? 'pointer' : 'auto' }} onClick={(e) => (header === ('id' || '_id') ? e.preventDefault() : handleSort(header))}>
                                                    {header === ('id' || '_id')
                                                        ? (<i className="bi bi-hash" ></i>)
                                                        : (ucwords(header))}
                                                    {sortConfig.key === header ? (sortConfig.direction === 'asc' ? '  ▲' : '  ▼') : ''}
                                                </th>
                                            ))}
                                            <th className='action' >Action</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <th colSpan={headers.length + 1} className='text-center'>
                                            <Loading />
                                        </th>
                                    </tr>
                                ) : (data && data.length > 0 ? (data.map((item, i) => (
                                    <tr key={item.id} className='p-2'>
                                        {headers.map((header, index) => {
                                            const content = columnCondication(header, item[header], (i + ((currentPage - 1) * dataLimit)));
                                            return (
                                                <td key={index} className={``} >
                                                    {content}
                                                </td>);
                                        })}
                                        <td className='action w-100'>
                                            <>
                                                {handelView && (
                                                    <Button iconClass="bi bi-eye" tooltip={ucwords(`view ${item?.name}`)} url={`${item?.id}`} />
                                                )}
                                                {item.status === true && handelEdit && (
                                                    <Button iconClass="bi bi-pencil-square" tooltip={ucwords(`edit ${item?.name}`)} url={`${item?.id}/edit`} />
                                                )}
                                                {item.status === false && handelDelete && (
                                                    <Button iconClass="bi bi-trash" onClick={() => { handelDeleteModel(item.id); setSelectedItemName(item?.name); }} tooltip={ucwords(`delete ${item?.name}`)} />
                                                )}
                                            </>
                                        </td>
                                    </tr>
                                ))) : (<tr>
                                    <th colSpan={headers.length + 1} className='text-center'>
                                        No Data Found!...
                                    </th>
                                </tr>))}
                            </tbody>
                            <tfoot >
                                <tr>
                                    <td colSpan={headers.length + 1}>
                                        <div className={`position-relative`}>
                                            {dataCount >= dataLimit && (
                                                <>
                                                    <div className={`position-absolute my-auto py-3`}>Showing {start} to {end} of {dataCount} entries</div>
                                                    <Pageignation totalPages={totalPages} currentPage={currentPage} handlePageChange={handlePageChange} />
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
            <ReusableModal
                show={modalDeleteShow}
                handleClose={() => setModalDeleteShow(false)}
                title={`Confirm Delete`}
                body={`Are your want to delete ${selectedItemName ?? 'item'}`}
                primaryAction={handleDeleteConfirm}
                primaryLabel={`Delete`}
                primaryVariant={`danger`}
                secondaryLabel={`Cancel`}
            />
            <ReusableModal
                show={modalStatusShow}
                handleClose={() => setModalStatusShow(false)}
                title={`Status Change`}
                body={`Are your want to ${selectedItemName ?? ''} status`}
                primaryAction={handleStatusChangeConfirm}
                primaryLabel={`Change`}
                secondaryLabel={`Cancel`}
            />
        </>
    );
}

export default Table