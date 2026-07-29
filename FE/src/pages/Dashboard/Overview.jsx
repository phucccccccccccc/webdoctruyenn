import { Row, Col } from "react-bootstrap";

import StatsCard from "./Overview/StatsCard";
import RevenueChart from "./Overview/RevenueChart";
import SalesSummary from "./Overview/SalesSummary";
import TopSales from "./Overview/TopSales";
import TopReading from "./Overview/TopReading";
import RecentTransaction from "./Overview/RecentTransaction";

export default function Overview() {

    return (

        <>

            <StatsCard />

            <Row className="mt-4">

                <Col lg={8}>

                    <RevenueChart />

                </Col>

                <Col lg={4}>

                    <SalesSummary />

                </Col>

            </Row>

            <Row className="mt-4">

                <Col lg={6}>

                    <TopSales />

                </Col>

                <Col lg={6}>

                    <TopReading />

                </Col>

            </Row>

            <Row className="mt-4">

                <Col>

                    <RecentTransaction />

                </Col>

            </Row>

        </>

    );

}