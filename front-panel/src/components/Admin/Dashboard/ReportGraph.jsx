import React from 'react'
import { Filter } from './Filter'
import ReportsChart from './ReportsChart'
import { useDashboard } from '../../../context/DashBoardContext'
import { ucwords } from '../../../utils/helper'

export const ReportGraph = () => {
    const { reportFilter, setReportFilter } = useDashboard();
    return (
        <>
            <div className="col-12">
                <div className={`card`}>
                    <Filter setFilterFunction={setReportFilter} />
                    <div className={`card-body`}>
                        <h5 className="card-title">Reports <span>| {ucwords(reportFilter)}</span></h5>
                        <ReportsChart />
                    </div>
                </div>
            </div>
        </>
    )
};