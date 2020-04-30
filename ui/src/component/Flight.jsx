import React from "react";
import PropTypes from "prop-types";
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




class Flight extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            lists: [],
            articlesDetails: [],
            activePage: 1,
            totalPages: null,
            itemsCountPerPage: null,
            totalItemsCount: null,
        };
        this.handlePageChange = this.handlePageChange.bind(this);
        this.fetchURL = this.fetchURL.bind(this);
    }

    fetchURL(page) {

        axios.post(`http://localhost:8080/flights?page=${page-1}&size=5`, this.state.searchCr
        /* {
            "adults": 1,
            "cabinClass": "ECONOMY",
            "children": 0,
            "currencyCode": "USD",
            "departDate": 1574246736000,
            "fromLocation": "LGW",
            "returnDate": 0,
            "ticketType": "ONEWAY",
            "toLocation": "JFK"
          }*/
          )
            .then(response => {
                this.setState({ isLoading: true });
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


    componentDidMount() {
        this.fetchURL(this.state.activePage)
    }

    handlePageChange(pageNumber) {
        console.log(`active page is ${pageNumber}`);
        this.setState({ activePage: pageNumber })
        this.fetchURL(pageNumber)

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



    render() {
    
        const { isLoading } = this.state;

        if (isLoading) {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <Loader
                        type="Plane"
                        color="#00BFFF"
                        height={100}
                        width={100}
                    />
                </div>)

        }

        return (



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
    }
}


// <div>
//     {this.state.lists.map((list) => {
//         var rows = [];

//         for (let index = 0; index < list.routes.length; index++) {
//             rows.push(<li key={index} >{list.routes[index].cityNameFrom} → {list.routes[index].cityNameTo}</li>);

//         }


//         return (



//             <div key={list.bookingToken} style={{ borderBottom: '1px solid black' }}>




//                 <tbody>{rows}</tbody>
//                 <body>{list.price}€</body>
//                 <a href={list.bookingToken}>BUY</a>
//             </div>
//         );



// if (list.ticketType == TicketType.ONEWAY) {
//     return (
//         <div key={list.bookingToken} style={{ borderBottom: '1px solid black' }}>
//             <h1>{list.routes[0].cityNameFrom} - {list.routes[0].cityNameTo} and {list.routes[1].cityNameFrom} - {list.routes[1].cityNameTo}</h1>
//             <h2>{list.price}€</h2>
//             <a href={list.bookingToken}>BUY</a>
//         </div>
//     )
// } else if (list.ticketType == TicketType.ONEWAY) {
//     return (<div key={list.bookingToken} style={{ borderBottom: '1px solid black' }}>
//         <h1>{list.routes[0].cityNameFrom} - {list.routes[0].cityNameTo}</h1>
//         <h2>{list.price}€</h2>
//         <a href={list.bookingToken}>BUY</a>
//     </div>)
// }



//                 })}
//             </div>        
//         )
//     }
// }


Flight.propTypes = {
    id: PropTypes.array,
    flightNumber: PropTypes.string,
    airlineName: PropTypes.string,
    cabinClass: PropTypes.string,
    duration: PropTypes.array,
    departTime: PropTypes.array,
    departAirportCode: PropTypes.string,
    departCityName: PropTypes.string,
    arrivalTime: PropTypes.array,
    arrivalAirportCode: PropTypes.string,
    arrivalCityName: PropTypes.string
};



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

// export default Flight;
