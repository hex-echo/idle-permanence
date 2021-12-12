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
    //event.preventDefault();
    var return_balance = 0;
    var idleInstance;
    App.contracts.Idle.deployed().then(function(instance) {
      idleInstance = instance;
      return idleInstance.getBalance.call();
    }).then(function(balance) {
      console.log(balance);
      return_balance = balance;
      balance.toNumber();
      $('#balance-text').text('Balance: ' + balance);
      window.unityInstance.SendMessage('container', 'ReceiveBalance', 'Balance: ' + balance)
      return idleInstance.getManagerCount.call();
    }).then(function(manager_count) {
      manager_count.toNumber();
      $('#manager-count-text').text('Number of managers: ' + manager_count);
      window.unityInstance.SendMessage('container', 'ReceiveManagerCount', 'Managers: ' + manager_count)
      return idleInstance.getManagerFactor.call();
    }).then(function(factor) {
      factor.toNumber();
      $('#manager-factor-text').text('Upgrades: ' + factor);
      window.unityInstance.SendMessage('container', 'ReceiveManagerFactor', 'Upgrades: ' + factor)
    }).catch(function(err) {
      console.log(err.message);
    });
    return return_balance;
  },

  initAccount: function(event) {
    console.log('init');
    //event.preventDefault();

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
    //event.preventDefault();

    var idleInstance;
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Idle.deployed().then(function(instance) {
        idleInstance = instance;

        // Execute adopt as a transaction by sending account
        return idleInstance.updateBalance({from: account});
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
