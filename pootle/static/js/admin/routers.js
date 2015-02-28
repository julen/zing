/*
 * Copyright (C) Pootle contributors.
 *
 * This file is a part of the Pootle project. It is distributed under the GPL2
 * license. See the LICENSE file for a copy of the license and the AUTHORS file
 * for copyright and authorship information.
 */

'use strict';

var Backbone = require('backbone');


var AdminRouter = Backbone.Router.extend({

  routes: {
    '': 'main',
    ':id(/)': 'edit'
  }

});


module.exports = AdminRouter;
