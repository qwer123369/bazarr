import React, { FunctionComponent } from "react";
import { Column } from "react-table";

import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { ActionIcon, BasicTable } from "../../components";

import { HistoryActionIcon } from "../components";

interface Props {
  movieHistory: MovieHistory[];
}

function mapStateToProps({ movie }: StoreState) {
  const { historyList } = movie;
  return {
    movieHistory: historyList.items,
  };
}

const Table: FunctionComponent<Props> = (props) => {
  const { movieHistory } = props;

  const columns: Column<MovieHistory>[] = React.useMemo<Column<MovieHistory>[]>(
    () => [
      {
        accessor: "action",
        Cell: (row) => (
          <HistoryActionIcon action={row.value}></HistoryActionIcon>
        ),
      },
      {
        Header: "Title",
        accessor: "title",
        Cell: (row) => {
          const target = `/movies/${row.row.original.radarrId}`;

          return (
            <Link to={target}>
              <span>{row.value}</span>
            </Link>
          );
        },
      },
      {
        Header: "Date",
        accessor: "timestamp",
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Actions",
        accessor: "radarrId",
        Cell: (row) => {
          return null;
        },
      },
    ],
    []
  );

  return <BasicTable options={{ columns, data: movieHistory }}></BasicTable>;
};

export default connect(mapStateToProps)(Table);
