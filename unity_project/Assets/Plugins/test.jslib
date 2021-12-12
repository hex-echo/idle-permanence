mergeInto(LibraryManager.library, {
  MetaFetch: function () {
      App.fetchValues(null);
  },

  MetaInit: function () {
      App.initAccount(null);
  },

  MetaUpdate: function () {
      App.updateValues(null);
  },
  MetaStartIdle: function () {
      event = { data: {}, preventDefault: function() {;} }
      App.startIdle(event);
  },
  MetaStartWoodcutting: function () {
      event = { data: {}, preventDefault: function() {;} }
      App.startWoodcutting(event);
  },
  MetaStartMining: function () {
      event = { data: {}, preventDefault: function() {;} }
      App.startMining(event);
  },
  MetaBuyUpgrade: function (_upgrade_id, _amount) {
      event = { data: {upgrade_id: _upgrade_id, amount: _amount}, preventDefault: function() {;} }
      App.buyUpgrade(event);
  }
  MetaSellResource: function (_resource_id, _amount) {
      event = { data: {resource_id: _resource_id, amount: _amount}, preventDefault: function() {;} }
      App.sellResource(event);
  }
});
/*
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
*/