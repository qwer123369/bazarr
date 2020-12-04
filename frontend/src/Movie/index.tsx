import React from "react";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";

import { faList } from "@fortawesome/free-solid-svg-icons";

import {
  ContentHeader,
  ContentHeaderButton,
  EditItemModal,
} from "../components";
import { Container } from "react-bootstrap";

import Table from "./table";

interface Props {}
interface State {
  modal?: Movie;
}
class MovieView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      modal: undefined,
    };
  }

  onMovieEditClick(movie: Movie) {
    this.setState({
      ...this.state,
      modal: movie,
    });
  }

  onMovieEditClose() {
    this.setState({
      ...this.state,
      modal: undefined,
    });
  }
  render() {
    const { modal } = this.state;

    return (
      <Container fluid className="p-0">
        <Helmet>
          <title>Movies - Bazarr</title>
        </Helmet>
        <ContentHeader>
          <ContentHeaderButton iconProps={{ icon: faList }}>
            Mass Edit
          </ContentHeaderButton>
        </ContentHeader>
        <div className="p-3">
          <Table openMovieEditor={this.onMovieEditClick.bind(this)}></Table>
        </div>
        <EditItemModal
          item={modal}
          onClose={this.onMovieEditClose.bind(this)}
        ></EditItemModal>
      </Container>
    );
  }
}

export default connect()(MovieView);
