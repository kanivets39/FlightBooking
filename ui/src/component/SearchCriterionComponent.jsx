import React, { Component } from 'react'
import ApiService from "../service/ApiService";
import FlightSearchForm from './FlightSearchForm';
import GeneralSearchForm from './GeneralSearchForm';
// import Flight from './Flight'
import axios from 'axios';



import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from 'react-loader-spinner';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
// import { Date as DateM } from "moment";
import Moment from 'react-moment';
import Pagination from "react-js-pagination";
import 'bootstrap/dist/css/bootstrap.min.css';


class SearchCriterionComponent extends Component {


    constructor(props) {
        super(props);
        this.state = {
            ticketType: 'ONEWAY',
            currencyCode: 'USD',
            cabinClass: 'ECONOMY',
            adults: '1',
            children: '0',
            fromLocation: '',
            toLocation: '',
            departDate: '',
            returnDate: '0',
            departDateLong: '',
            returnDateLong: '',
            searchCr: {
                "adults": 1,
                "cabinClass": "ECONOMY",
                "children": 0,
                "currencyCode": "",
                "departDate": 999999999999,
                "fromLocation": "",
                "returnDate": 999999999999,
                "ticketType": "ONEWAY",
                "toLocation": ""
            },
            showResults: false,
            isLoading: false,
            lists: [],
            articlesDetails: [],
            activePage: 1,
            totalPages: null,
            itemsCountPerPage: null,
            totalItemsCount: null,
        }
        this.getTickets = this.getTickets.bind(this);
        this.onChange = this.onChange.bind(this);
        this.getInitialState = this.getInitialState.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.fetchURL = this.fetchURL.bind(this);

    }

    getTickets = (e) => {
        e.preventDefault();
        let searchCriterion = {
            currencyCode: this.state.currencyCode, ticketType: this.state.ticketType,
            cabinClass: this.state.cabinClass, adults: this.state.adults, children: this.state.children,
            fromLocation: this.state.fromLocation, toLocation: this.state.toLocation, departDate: this.state.departDateLong,
            returnDate: this.state.returnDateLong
        };



        this.setState({ 'searchCr': searchCriterion });

        this.setState({ showResults: true });

        this.setState({ isLoading: true });
        
        this.fetchURL(1);



        // console.log(this.state.searchCr);
    }



    fetchURL(page) {

        axios.post(`http://localhost:8080/flights?page=${page - 1}&size=5`, this.state.searchCr)
            .then(response => {

                
                const totalPages = response.data.totalPages;
                const itemsCountPerPage = response.data.size;
                const totalItemsCount = response.data.totalElements;

                this.setState({ totalPages: totalPages })
                this.setState({ totalItemsCount: totalItemsCount })
                this.setState({ itemsCountPerPage: itemsCountPerPage })

                console.log(response.data);
                this.setState({ lists: response.data.content, isLoading: false });

                const lists = response.data.content;
                this.setState({ isLoading: false });


                const updatedResults = lists.map(results => {

                    var timestamp = new Date(lists.pubDate)
                    var dateString = timestamp.toUTCString()
                    return {
                        ...lists, dateString
                    }
                });

                this.setState({ articlesDetails: updatedResults });
                console.log(updatedResults);
                console.log(this.state.activePage);
                console.log(this.state.itemsCountPerPage);


            }
            );
    }


    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        if (e.target.name === "departDate" || e.target.name === "returnDate") {
            let timeLong = (new Date(e.target.value)).getTime();
            this.setState({ [e.target.name + 'Long']: timeLong });
        }

    }

    getInitialState = (e) =>
        this.setState(e.target.value);

    componentDidMount() {
        this.fetchURL(this.state.activePage)
    }

    handlePageChange(pageNumber) {
        console.log(`active page is ${pageNumber}`);
        this.setState({ activePage: pageNumber })
        this.fetchURL(pageNumber)

    }


    render() {
        return (
            <div>
                <h2 className="text-center">Flight Search</h2>
                <form >
                    <GeneralSearchForm
                        currencyCode={this.state.currencyCode}
                        cabinClass={this.state.cabinClass}
                        adults={this.state.adults}
                        children={this.state.children}
                        onChange={this.onChange}
                    />

                    <FlightSearchForm
                        ticketType={this.state.ticketType}
                        fromLocation={this.state.fromLocation}
                        toLocation={this.state.toLocation}
                        departDate={this.state.departDate}
                        returnDate={this.state.returnDate}
                        onChange={this.onChange}
                        getInitialState={this.getInitialState}
                    />

                    <button className="btn btn-success" onClick={this.getTickets}>Search</button>
                </form>

                <div>

                    {this.state.showResults ?


                        (this.state.isLoading ?

                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                                <Loader
                                    type="Plane"
                                    color="#00BFFF"
                                    height={100}
                                    width={100}
                                />
                            </div>

                            :

                            <Paper>
                                <Table >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ fontWeight: "bold" }}>Routes</TableCell>
                                            <TableCell style={{ fontWeight: "bold" }} align="left">Depart time  → Arrival time</TableCell>
                                            <TableCell style={{ fontWeight: "bold" }} align="left">Duration</TableCell>
                                            <TableCell style={{ fontWeight: "bold" }} align="right">Provider</TableCell>
                                            <TableCell style={{ fontWeight: "bold" }} align="right">Price</TableCell>
                                            <TableCell style={{ fontWeight: "bold" }} align="right"></TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>

                                        {this.rowsWithData()}

                                    </TableBody>

                                </Table>
                                <div className="d-flex justify-content-center">
                                    <Pagination
                                        hideNavigation
                                        activePage={this.state.activePage}
                                        itemsCountPerPage={this.state.itemsCountPerPage}
                                        totalItemsCount={this.state.totalItemsCount}
                                        pageRangeDisplayed={10}
                                        itemClass='page-item'
                                        linkClass='btn btn-light'
                                        onChange={this.handlePageChange}
                                    />
                                </div>
                            </Paper>

                        )


                        : null}

                </div>


            </div>


        );
    }


    rowsWithData = () => {
        const tableData = this.state.lists.map((list) => {

            var routesRows = [];

            var timeRows = [];
            var durationRows = [];


            for (let index = 0; index < list.routes.length; index++) {
                routesRows.push(<li key={index} >{list.routes[index].cityNameFrom} → {list.routes[index].cityNameTo}</li>);
                timeRows.push(<li key={index} ><Moment unix format="LT Z UTC l">{list.routes[index].flights[0].departTime}</Moment> → <Moment unix format="LT Z UTC l ">{list.routes[index].flights[0].arrivalTime}</Moment></li>);
                durationRows.push(<li key={index} >{secondsToHms(list.routes[index].duration)}</li>);
            }

            return <TableRow key={list.bookingToken}>

                <TableCell >{routesRows}</TableCell>

                <TableCell align="left">{timeRows}</TableCell>
                <TableCell align="left">{durationRows}</TableCell>
                <TableCell style={{ fontStyle: "italic" }} align="right">{list.provider}</TableCell>
                <TableCell align="right">{list.price}</TableCell>
                <TableCell align="right" component="th" scope="row">
                    <a href={list.bookingToken}>BUY</a>
                </TableCell>
            </TableRow>
        });
        return tableData
    }





}


function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay;
}

export default SearchCriterionComponent;