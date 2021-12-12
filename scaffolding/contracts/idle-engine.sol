// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/** 
 * @title Ballot
 * @dev Implements voting process along with vote delegation
 */
contract Idle {
   
   struct PlayerData{
        address addr;
        uint256 current_balance;
        uint32 manager_count;
        uint32 manager_factor;
        uint last_timestamp;
    }
    mapping(address => PlayerData) public players;

    /*
    struct Voter {
        uint weight; // weight is accumulated by delegation
        bool voted;  // if true, that person already voted
        address delegate; // person delegated to
        uint vote;   // index of the voted proposal
    }

    
    struct Proposal {
        // If you can limit the length to a certain number of bytes, 
        // always use one of bytes1 to bytes32 because they are much cheaper
        bytes32 name;   // short name (up to 32 bytes)
        uint voteCount; // number of accumulated votes
    }

    
    address public chairperson;

    mapping(address => Voter) public voters;

    Proposal[] public proposals;
    */
    function getBalance() public view returns (uint256 curr_balance) {
        PlayerData storage player_data = players[msg.sender];
        return player_data.current_balance;
    }
    function getManagerCount() public view returns (uint32 num_managers) {
        PlayerData storage player_data = players[msg.sender];
        return player_data.manager_count;
    }
    function getManagerFactor() public view returns (uint32 factor) {
        PlayerData storage player_data = players[msg.sender];
        return player_data.manager_factor;
    }
    function init() public returns (uint256 curr_balance) {
        PlayerData storage player_data = players[msg.sender];
        player_data.current_balance += 100;
        if(player_data.manager_count == 0){
            player_data.manager_count = 1;
            player_data.manager_factor = 1;
            player_data.last_timestamp = block.timestamp;
        }
        return player_data.current_balance;
    }
    function updateBalance() public returns (uint256 curr_balance){
        PlayerData storage player_data = players[msg.sender];
        player_data.current_balance += player_data.manager_count * player_data.manager_factor * (block.timestamp - player_data.last_timestamp);
        player_data.last_timestamp = block.timestamp;
        return player_data.current_balance;
    }
}
