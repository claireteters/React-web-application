import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
    }

    search() {
        this.props.onSearch(this.state.search);
    }

    handleTermChange(event) {
        this.setState({search: event.target.value});
    }

    render() {
        return (
            <div className="SearchBar">
                <input onChange={this.handleTermChange} placeholder="Enter A Song, Album, or Artist" />
                <a onClick={this.search}>search</a>
            </div>
        )
    }
};

export default SearchBar;