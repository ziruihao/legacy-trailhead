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
      tags: [
        { id: 'Thailand', text: 'my.buddy.21@dartmouth.edu' },
        { id: 'India', text: 'my.driver.21@dartmouth.edu' },
      ],
      suggestions: [
        { id: 'USA', text: 'USA' },
        { id: 'Germany', text: 'Germany' },
        { id: 'Austria', text: 'Austria' },
        { id: 'Costa Rica', text: 'Costa Rica' },
        { id: 'Sri Lanka', text: 'Sri Lanka' },
        { id: 'Thailand', text: 'Thailand' },
      ],
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    // this.handleDrag = this.handleDrag.bind(this);
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
  }

  handleAddition(tag) {
    this.setState(state => ({ tags: [...state.tags, tag] }));
  }

  // handleDrag(tag, currPos, newPos) {
  //   const tags = [...this.state.tags];
  //   const newTags = tags.slice();

  //   newTags.splice(currPos, 1);
  //   newTags.splice(newPos, 0, tag);

  //   // re-render
  //   this.setState({ tags: newTags });
  // }

  render() {
    const { tags, suggestions } = this.state;
    return (
      <div>
        <ReactTags
          placeholder="Enter email(s)"
          tags={tags}
          suggestions={suggestions}
          handleDelete={this.handleDelete}
          handleAddition={this.handleAddition}
          // handleDrag={this.handleDrag}
          delimiters={delimiters}
          allowDragDrop={false}
        />
      </div>
    );
  }
}

export default CoLeadersAutoComplete;
