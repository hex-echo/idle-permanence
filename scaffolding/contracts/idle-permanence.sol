// SPDX-License-Identifier: UNLICENSED
//authors: 0xmarketcrash(https://github.com/0xmarketcrash) & hex-echo (https://github.com/hex-echo/)

pragma solidity >=0.7.0 <0.9.0;

contract Idle {
   

    bool private isInited = false;

    //solidity does not have definitives...so needed an alternative to remain sane for readability
    //is there a better alternative?
    uint16 constant public action_id_idle = 0;
    uint16 constant public action_id_woodcutting = 1;
    uint16 constant public action_id_mining = 2;
    uint16 constant public action_id_firemaking = 3;
    uint16 constant public action_id_smithing = 4;
    
    uint constant public moonie_id_currency = 0;
    uint constant public moonie_id_logs = 1;
    uint constant public moonie_id_ore = 2;
    uint constant public moonie_id_charcoal = 3;
    uint constant public moonie_id_bars = 4;

    uint constant public upgrade_id_hatchet = 1;
    uint constant public upgrade_id_pickaxe = 2;
    uint constant public upgrade_id_kindle = 3;
    uint constant public upgrade_id_furnace = 4;
    uint constant public upgrade_id_manager_woodcutting = 5;
    uint constant public upgrade_id_manager_mining = 6;
    uint constant public upgrade_id_manager_firemaking = 7;
    uint constant public upgrade_id_manager_smithing = 8;

    uint constant public moonie_cost_logs = 100;
    uint constant public moonie_cost_ore = 100;
    uint constant public moonie_cost_charcoal = 25;
    uint constant public moonie_cost_bars = 125;
    
    event playerActionChange(uint16 action_state);
    event invalidActionState(uint16 action_state);

    struct PlayerData{
        address player_addr;
        string player_name;
        uint16 curr_player_action_id;
        uint256 last_timestamp;
        uint256[5] player_moonies;
        uint256[] player_upgrades;
    }

    struct Action{
        uint16 action_id;
        uint16 difficulty;
    }
    

    Action[] public actions;
    mapping(address => PlayerData) public players;


    //Initaliztion that is cursed...ideas how to improve????
    function actionFactory() private{
        //Action Class: uint16 Action ID, uint16 Action Difficulty
        //idle
        actions.push(Action(action_id_idle, 0));
        //woodcutting
        actions.push(Action(action_id_woodcutting, 1));
        //mining
        actions.push(Action(action_id_mining, 1));
        //firemaking
        actions.push(Action(action_id_firemaking, 2));
        //smithing
        actions.push(Action(action_id_smithing, 3));
    }

    function changeAction(uint16 _action_id) public {
        //Future Consideration: what to do if input action is not valid?
        //default to idle? break and send an error message? maintain original idle state
        //what should the client do?
        PlayerData storage player_data = players[msg.sender];
        require(player_data.player_addr != address(0),"This address has not been stored before");
        if(_action_id == action_id_woodcutting){
            actionWoodcutting(_action_id);
        }else if(_action_id == action_id_mining){
            actionMining(_action_id);
        }else if(_action_id == action_id_firemaking){
            actionFiremaking(_action_id);
        }else if(_action_id == action_id_smithing){
            actionSmithing(_action_id);
        }else{
            //notify when invalid action state is sent and default player to idle action
            if(_action_id != action_id_idle){
                emit invalidActionState(_action_id);
            }
            actionIdle(_action_id);
        }
        
    }

    //
    function setActionState(uint16 _action_id) private {
        PlayerData storage player_data = players[msg.sender];
        require(player_data.player_addr != address(0),"This address has not been stored before");
        player_data.curr_player_action_id = _action_id;
        emit playerActionChange(_action_id);
    }

    //Future Consideration: temporary idle boost?
    function actionIdle(uint16 _action_id) private {
        setActionState(_action_id);
    }

    //action functions currently only account for 1 type of resource accumulation: 1 log (moonie_ID: 1)

    
    function actionWoodcutting(uint16 _action_id) private returns (uint256 log_balance){
        PlayerData storage player_data = players[msg.sender];
        setActionState(_action_id);
        //productivity boosed based on hatchet level & woodcutting manager level
        player_data.player_moonies[moonie_id_logs] += ((player_data.player_upgrades[upgrade_id_hatchet] * player_data.player_upgrades[upgrade_id_manager_woodcutting]) / actions[action_id_woodcutting].difficulty) * (block.timestamp - player_data.last_timestamp);
        player_data.last_timestamp = block.timestamp;
        setActionState(_action_id);
        return player_data.player_moonies[moonie_id_logs];
    }



    function actionMining(uint16 _action_id) private returns (uint256 mining_balance){
        PlayerData storage player_data = players[msg.sender];
        setActionState(_action_id);
        //productivity boosed based on pickaxe level & mining manager level
        player_data.player_moonies[moonie_id_ore] += ((player_data.player_upgrades[upgrade_id_pickaxe] * player_data.player_upgrades[upgrade_id_manager_mining]) / actions[action_id_mining].difficulty) * (block.timestamp - player_data.last_timestamp);
        player_data.last_timestamp = block.timestamp;
        setActionState(_action_id);
        return player_data.player_moonies[moonie_id_ore];
    }

    //dont call this right now...it no work
    function actionFiremaking(uint16 _action_id) private returns (uint256 charcoal_balance) {
        PlayerData storage player_data = players[msg.sender];
        setActionState(_action_id);
        //productivity boosed based on kindle level & firemaking manager level
        player_data.player_moonies[moonie_id_logs] -= ((player_data.player_upgrades[upgrade_id_kindle] * player_data.player_upgrades[upgrade_id_manager_firemaking]) / actions[action_id_firemaking].difficulty) * (block.timestamp - player_data.last_timestamp);
        player_data.last_timestamp = block.timestamp;
        return player_data.player_moonies[moonie_id_charcoal];
        
    }

    //dont call this right now...it no work
    function actionSmithing(uint16 _action_id) private returns (uint256 ore_balance) {
        PlayerData storage player_data = players[msg.sender];
        setActionState(_action_id);
        //productivity boosed based on furnace level & smithing manager level
        player_data.player_moonies[moonie_id_ore] -= ((player_data.player_upgrades[upgrade_id_furnace] * player_data.player_upgrades[upgrade_id_manager_smithing]) / actions[action_id_smithing].difficulty) * (block.timestamp - player_data.last_timestamp);
        player_data.last_timestamp = block.timestamp;
        return player_data.player_moonies[moonie_id_bars];
        
    }


    function purchaseUpgrade(uint _upgrade_id, uint _amt_purchased) public{
        PlayerData storage player_data = players[msg.sender];
        uint256 upgrade_cost = getCalculatedUpgradePurchase(player_data.player_upgrades[_upgrade_id], _amt_purchased);
        require(upgrade_cost < player_data.player_moonies[moonie_id_currency],"cost of upgrades exceeds amount of currency the player holds");
        //is this a vulnerability?
        setUpgrade(_upgrade_id, (uint256(_amt_purchased) + player_data.player_upgrades[_upgrade_id]));
    }

    function getCalculatedUpgradePurchase(uint256 _currUpgradeLevel, uint _amt_purchased) public pure returns(uint256 upgrade_cost){
        //One day i'll learn how to do math... so i can do 5^2 + 5^3 + 5^4
        
        /*
            For the linear upgrade cost function: 
            cost = factor * next_level
            the cost to upgrade from level a to level b is 
            f(b) - f(a - 1)
            where f(x) = factor * (x(x +1)) / 2
        */
        uint256 factor = 2;
        uint256 fb = factor * ((_currUpgradeLevel + _amt_purchased) * (_currUpgradeLevel + _amt_purchased+1)) / 2;
        uint256 fa = factor * (_currUpgradeLevel * (_currUpgradeLevel+1)) / 2;
        return fb - fa;
    }

    //classed by purchaseUpgrade(uint _upgrade_id, uint _amt_purchased)
    function setUpgrade(uint _upgrade_id, uint256 new_upgrade_amt) private{
        //Future TODO: allow for multiple upgrades to be purchased simultaneously to minimize the number of trnxs...probably a seperate function for cleanliness
        PlayerData storage player_data = players[msg.sender];
        player_data.player_upgrades[_upgrade_id] = new_upgrade_amt;
    }

    //sets the value for an individual moonie resource
    function setMoonie(uint _moonie_id, uint256 _new_moonie_amt) private{
        PlayerData storage player_data = players[msg.sender];
        player_data.player_moonies[_moonie_id] = _new_moonie_amt;
    }

    //
    function sellMoonies(uint _moonie_id, uint _amt_sold) public returns (uint sale_amt)
    {
        PlayerData storage player_data = players[msg.sender];
        require(_amt_sold <= player_data.player_moonies[_moonie_id], "amount attempted to sell exceeds number of owned moonies");
        uint256 sale = getCalculatedMoonieSale(_moonie_id,_amt_sold);
        setMoonie(_moonie_id, _amt_sold);
        return sale;
     }

    function getCalculatedMoonieSale(uint _moonie_id, uint _amt_sold) public pure returns (uint256 sale_amt)
    {
        uint256 sale = 0;
        
        if(_moonie_id == moonie_id_logs){
            //moonie logs: 100
            sale = _amt_sold * moonie_cost_logs;
        }else if(_moonie_id == moonie_id_ore){
            //moonie ores: 100
            sale = _amt_sold * moonie_cost_ore;
        }else if(_moonie_id == moonie_id_charcoal){
            //moonie charcoal: 25
            sale = _amt_sold * moonie_cost_charcoal;
        }else if(_moonie_id == moonie_id_bars){
            //moonie bars: 125
            sale = _amt_sold * moonie_cost_bars;
        }else{
            
        }
        return sale;
    }
    

    function getMoonieBalance(uint16 _moonie_id) public view returns (uint256 moonie_balance) {
        PlayerData storage player_data = players[msg.sender];
        return player_data.player_moonies[_moonie_id];
    }

    function getMoonie() public view returns (uint256[5] memory moonies){
        PlayerData storage player_data = players[msg.sender];
        return player_data.player_moonies;
    }

    function getUpgradeLevel(uint16 _upgrade_id) public view returns (uint256 upgrade_level) {
        PlayerData storage player_data = players[msg.sender];
        require(player_data.player_addr == address(0), "This address has not been stored before");
        return player_data.player_upgrades[_upgrade_id];
    }

    function init() public {
        //throws error if this function is called after initalization
        require(isInited == false, "this contract has already been initalized, anon.");
        PlayerData storage player_data = players[msg.sender];
        //creates actions
        actionFactory();
        //gives player some moonies
        player_data.player_moonies = [100, 0, 0, 0, 0];
        //defaults player to idle action
        setActionState(action_id_idle);
        isInited = true;
    }



}