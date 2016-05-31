/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

(function(document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');
  
  // Sets app default base URL
  app.baseUrl = '/';
  if (window.location.port === '') {  // if production
    // Uncomment app.baseURL below and
    // set app.baseURL to '/your-pathname/' if running from folder in production
    // app.baseUrl = '/polymer-starter-kit/';
  }

  app.displayInstalledToast = function() {
    // Check to make sure caching is actually enabled—it won't be in the dev environment.
    if (!Polymer.dom(document).querySelector('platinum-sw-cache').disabled) {
      Polymer.dom(document).querySelector('#caching-complete').show();
    }
  };

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
    console.log('Our app is ready to rock!');
      var authCtrl = document.querySelector('#authCtrl');
  });
  
  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
    // imports are loaded and elements have been registered
  });

  // Main area's paper-scroll-header-panel custom condensing transformation of
  // the appName in the middle-container and the bottom title in the bottom-container.
  // The appName is moved to top and shrunk on condensing. The bottom sub title
  // is shrunk to nothing on condensing.
  window.addEventListener('paper-header-transform', function(e) {
    var appName = Polymer.dom(document).querySelector('#mainToolbar .app-name');
    var middleContainer = Polymer.dom(document).querySelector('#mainToolbar .middle-container');
    var bottomContainer = Polymer.dom(document).querySelector('#mainToolbar .bottom-container');
    var detail = e.detail;
    var heightDiff = detail.height - detail.condensedHeight;
    var yRatio = Math.min(1, detail.y / heightDiff);
    // appName max size when condensed. The smaller the number the smaller the condensed size.
    var maxMiddleScale = 0.50;
    var auxHeight = heightDiff - detail.y;
    var auxScale = heightDiff / (1 - maxMiddleScale);
    var scaleMiddle = Math.max(maxMiddleScale, auxHeight / auxScale + maxMiddleScale);
    var scaleBottom = 1 - yRatio;

    // Move/translate middleContainer
    Polymer.Base.transform('translate3d(0,' + yRatio * 100 + '%,0)', middleContainer);

    // Scale bottomContainer and bottom sub title to nothing and back
    Polymer.Base.transform('scale(' + scaleBottom + ') translateZ(0)', bottomContainer);

    // Scale middleContainer appName
    Polymer.Base.transform('scale(' + scaleMiddle + ') translateZ(0)', appName);
  });

  // Scroll page to top and expand header
  app.scrollPageToTop = function() {
    app.$.headerPanelMain.scrollToTop(true);
  };

  app.closeDrawer = function() {
    app.$.paperDrawerPanel.closeDrawer();
  };

  app.login = function () {
    authCtrl.login();
  }

  app.logout = function() {
    authCtrl.logout();
    app.loggedUser = null;
    window.location.href = "/";
  };

  app.dbLength = 994;
  app.testLength = 40;
  app.first = Math.floor(Math.random() * app.dbLength - (app.testLength -1));
  app.collection = '';
  app.loggedUser = null;
  app.questionsLoaded = false;

  app.firebaseURL = 'https://agilemeter.firebaseio.com';
  app.firebaseProvider = 'google';

  app.onFirebaseError = function(event) {
    this.$.errorToast.text = event.detail.message;
    this.$.errorToast.show();
  };
  app.onFirebaseLogin = function(event) {
    console.log(event.detail.user.uid);
    app.loggedUser = event.detail.user;
    app.collection = "https://agilemeter.firebaseio.com/questions";
    this.ref = new Firebase(this.firebaseURL + '/user/' + event.detail.user.uid);
    this.ref.on('value', function(snapshot) {
      app.updateItems(snapshot);
    });
  };

  app.items = [];

  app.updateItems = function(snapshot) {
    this.items = [];
    snapshot.forEach(function(childSnapshot) {
      var item = childSnapshot.val();
      item.uid = childSnapshot.key();
      this.push('items', item);
    }.bind(this));
  };

  app.addItem = function(event) {
    //event.preventDefault(); // Don't send the form!
    this.ref.push({
      done: false,
      text: app.newItemValue
    });
    app.newItemValue = '';
  };

  app.toggleItem = function(event) {
    this.ref.
      child(event.model.item.uid).
      update({done: event.model.item.done});
  };

  app.deleteItem = function(event) {
    this.ref.child(event.model.item.uid).remove();
  };

  app._isQuestion = function(question) {
    if (!question) return false;
    return question.__firebaseKey__ >= app.first && question.__firebaseKey__ < app.first + app.testLength;
  };

  app._computeSort = function(a, b) {
    if (a.question == b.question) {
        return 0;
    }
    return a.question > b.question ? -1 : 1;
  };

  app.doAnimation = function (argument) {
    if (document.querySelector('[data-question]')) {
      app.questionsLoaded = true;
      console.log(app.questionsLoaded);
    }
  };

  app.logged = function() {
   return app.logged;
  };

  app.register = function(answer) {
   console.log(answer);
  };

})(document);
