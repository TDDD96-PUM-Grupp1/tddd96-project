import PropTypes from 'prop-types';
import React, { Component } from 'react';
import PlayerInfo from './PlayerInfo';

class PlayerList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playerList: {},
    };

    this.getPlayers = this.getPlayers.bind(this);
    setInterval(this.getPlayers, 2000);
  }

  getPlayers() {
    const players = this.props.getPlayersFunction();
    this.setState({ playerList: players });
  }

  render() {
    const players = [];

    Object.keys(this.state.playerList).map(key => {
      players.push(<PlayerInfo key={key} id={key} playerObject={this.state.playerList[key]} />);
    });

    return <div>{players}</div>;
  }
}

PlayerList.propTypes = {
  getPlayersFunction: PropTypes.func.isRequired,
};

export default PlayerList;
