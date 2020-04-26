import React, { Component } from 'react';
import axios from 'axios';
import { WithContext as ReactTags } from 'react-tag-input';
import * as constants from '../constants';

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

class CoLeadersAutoComplete extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: [],
      suggestions: [],
      error: null,
      invalid: false, // invalid ID warning will appear if true
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
  }

  componentWillMount() {
    axios.get(`${constants.BACKEND_URL}/users`, { headers: { authorization: localStorage.getItem('token') } }).then((response) => {
      const parsedData = response.data.map((user) => {
        return { id: user._id, text: user.email };
      });
      this.setState({ suggestions: parsedData });
    });
  }

  handleDelete(i) {
    const { tags } = this.state;
    this.setState({
      tags: tags.filter((tag, index) => index !== i),
    });
    this.props.updateLeaderValue(this.state.tags);
  }

  handleAddition(tag) {
    // console.log(this.state.suggestions.find((sugg) => { return sugg.text === tag.text; }));
    if (typeof (this.state.suggestions.find((sugg) => { return sugg.text === tag.text; })) !== 'undefined') {
      this.setState(state => ({ tags: [...state.tags, tag] }));
      this.props.updateLeaderValue(this.state.tags);
    } else {
      this.setState({ invalid: true });
      setTimeout(() => { // Animation lasts 1.5 secs
        this.setState({ invalid: false });
      }, 15900);
    }
  }

  render() {
    console.log(this.state.error);
    const { tags, suggestions } = this.state;
    return (
      <div>
        <h1 className="invalid-email">
          {this.state.invalid ? '* Invalid email *' : null}
        </h1>
        <ReactTags
          placeholder="Enter email(s)"
          tags={tags}
          suggestions={suggestions}
          handleDelete={this.handleDelete}
          handleAddition={this.handleAddition}
          delimiters={delimiters}
          allowDragDrop={false}
          minQueryLength={3}
          allowUnique
        />

      </div>
    );
  }
}

export default CoLeadersAutoComplete;
