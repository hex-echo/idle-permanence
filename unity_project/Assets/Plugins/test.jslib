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
});