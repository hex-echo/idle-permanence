App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    return await App.initWeb3();
  },

  initWeb3: async function() {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });;
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

      return App.initContract();
    },

  initContract: function() {
    $.getJSON('Idle.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var IdleArtifact = data;
      App.contracts.Idle = TruffleContract(IdleArtifact);

      // Set the provider for our contract
      App.contracts.Idle.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      //return App.markAdopted();
      return 0;
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-fetch', App.fetchValues);
    $(document).on('click', '.btn-init', App.initAccount);
    $(document).on('click', '.btn-update', App.updateValues);
    $(document).on('click', '.btn-idle', App.startIdle);
    $(document).on('click', '.btn-woodcutting', App.startWoodcutting);
    $(document).on('click', '.btn-mining', App.startMining);
    $(document).on('click', '#btn-buy-hatchet', {upgrade_id: 0}, App.buyUpgrade);
    $(document).on('click', '#btn-buy-pickaxe', {upgrade_id: 1}, App.buyUpgrade);
    $(document).on('click', '#btn-buy-kindle', {upgrade_id: 2}, App.buyUpgrade);
    $(document).on('click', '#btn-buy-furnace', {upgrade_id: 3}, App.buyUpgrade);
    $(document).on('click', '#btn-buy-manager-woodcutting', {upgrade_id: 4}, App.buyUpgrade);
    $(document).on('click', '#btn-buy-manager-mining', {upgrade_id: 5}, App.buyUpgrade);
    $(document).on('click', '#btn-buy-manager-firemaking', {upgrade_id: 6}, App.buyUpgrade);
    $(document).on('click', '#btn-buy-manager-smithing', {upgrade_id: 7}, App.buyUpgrade);
    $(document).on('click', '#btn-sell-logs', {resource_id: 1}, App.sellResource);
    $(document).on('click', '#btn-sell-ore', {resource_id: 2}, App.sellResource);
    $(document).on('click', '#btn-sell-charcoal', {resource_id: 3}, App.sellResource);
    $(document).on('click', '#btn-sell-bars', {resource_id: 4}, App.sellResource);
  },

  markAdopted: function() {
    var idleInstance;
    App.contracts.Idle.deployed().then(function(instance) {
      idleInstance = instance;

      return idleInstance.getAdopters.call();
    }).then(function(adopters) {
      for (i = 0; i < adopters.length; i++) {
        if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  fetchValues: function(event) {
    event.preventDefault();
    var return_balance = 0;
    var idleInstance;
    App.contracts.Idle.deployed().then(function(instance) {
      idleInstance = instance;
      return idleInstance.getMoonie.call();
    }).then(function(moonie_array) {
      moonie_balance = moonie_array[0];
      moonie_balance.toNumber();
      $('#balance-text').text('Moonies: ' + moonie_balance);
      log_balance = moonie_array[1];
      log_balance.toNumber();
      $('#log-text').text('Logs: ' + log_balance);
      ore_balance = moonie_array[2];
      ore_balance.toNumber();
      $('#ore-text').text('Ores: ' + ore_balance);
      charcoal_balance = moonie_array[3];
      charcoal_balance.toNumber();
      $('#charcoal-text').text('Charcoal: ' + charcoal_balance);
      bar_balance = moonie_array[4];
      bar_balance.toNumber();
      $('#bar-text').text('Charcoal: ' + bar_balance);
      window.unityInstance.SendMessage('container', 'ReceiveBalance', 'Logs: ' + log_balance)
      return idleInstance.getUpgrades.call();
    }).then(function(upgrade_array) {
        hatchet_count = upgrade_array[0];
        hatchet_count.toNumber();
        $('#upgrade-hatchet-text').text('Hatchets: ' + hatchet_count);
        pickaxe_count = upgrade_array[1];
        pickaxe_count.toNumber();
        $('#upgrade-pickaxe-text').text('Pickaxes: ' + pickaxe_count);
        kindle_count = upgrade_array[2];
        kindle_count.toNumber();
        $('#upgrade-kindle-text').text('Kindle: ' + kindle_count);
        furnace_count = upgrade_array[3];
        furnace_count.toNumber();
        $('#upgrade-furnace-text').text('Furnaces: ' + furnace_count);
        woodcutting_manager_count = upgrade_array[4];
        woodcutting_manager_count.toNumber();
        $('#upgrade-manager-woodcutting-text').text('Woodcutting managers: ' + woodcutting_manager_count);
        mining_manager_count = upgrade_array[5];
        mining_manager_count.toNumber();
        $('#upgrade-manager-mining-text').text('Mining managers: ' + mining_manager_count);
        firemaking_manager_count = upgrade_array[6];
        firemaking_manager_count.toNumber();
        $('#upgrade-manager-firemaking-text').text('Firemaking managers: ' + firemaking_manager_count);
        smithing_manager_count = upgrade_array[7];
        smithing_manager_count.toNumber();
        $('#upgrade-manager-smithing-text').text('Smithing managers: ' + smithing_manager_count);
      return idleInstance.getCurrentActionID.call();
      }).then(function(action_id) {
        tmp_id = action_id; 
        action_id.toNumber();
        if(action_id == 0){ $('#current_action_text').text('Current action: Idle'); }
        if(action_id == 1){ $('#current_action_text').text('Current action: Woodcutting'); }
        if(action_id == 2){ $('#current_action_text').text('Current action: Mining'); }
        if(action_id == 3){ $('#current_action_text').text('Current action: Firemaking'); }
        if(action_id == 4){ $('#current_action_text').text('Current action: Smithing'); }
    }).catch(function(err) {
      console.log(err.message);
    });
    return return_balance;
  },

  initAccount: function(event) {
    console.log('init');
    event.preventDefault();

    var idleInstance;
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Idle.deployed().then(function(instance) {
        idleInstance = instance;

        // Execute adopt as a transaction by sending account
        return idleInstance.init({from: account});
      }).then(function(result) {
        return App.fetchValues();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },
  
  updateValues: function(event) {
    console.log('update');
    event.preventDefault();

    var idleInstance;
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Idle.deployed().then(function(instance) {
        idleInstance = instance;

        // Execute adopt as a transaction by sending account
        return idleInstance.actionWoodcutting(1,{from: account});
      }).then(function(result) {
        return App.fetchValues();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  startWoodcutting: function(event) {
    event.preventDefault();

    var idleInstance;
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.Idle.deployed().then(function(instance) {
        idleInstance = instance;
        // Execute adopt as a transaction by sending account
        return idleInstance.changeAction(1,{from: account});
      }).then(function(result) {
        return App.fetchValues();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },
  startMining: function(event) {
    event.preventDefault();

    var idleInstance;
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.Idle.deployed().then(function(instance) {
        idleInstance = instance;
        // Execute adopt as a transaction by sending account
        return idleInstance.changeAction(2,{from: account});
      }).then(function(result) {
        return App.fetchValues();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },
  startIdle: function(event) {
    event.preventDefault();
    var idleInstance;
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.Idle.deployed().then(function(instance) {
        idleInstance = instance;
        // Execute adopt as a transaction by sending account
        return idleInstance.changeAction(0,{from: account});
      }).then(function(result) {
        return App.fetchValues();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },
  buyUpgrade: function(event){
    event.preventDefault();
    upgrade_id = event.data.upgrade_id
    var idleInstance;
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.Idle.deployed().then(function(instance) {
        idleInstance = instance;
        // Execute adopt as a transaction by sending account
        return idleInstance.purchaseUpgrade(upgrade_id, 1,{from: account});
      }).then(function(result) {
        return App.fetchValues();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },
  sellResource: function(event){
    event.preventDefault();
    resource_id = event.data.resource_id
    var idleInstance;
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.Idle.deployed().then(function(instance) {
        idleInstance = instance;
        // Execute adopt as a transaction by sending account
        return idleInstance.sellMoonies(resource_id, 1,{from: account});
      }).then(function(result) {
        return App.fetchValues();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
