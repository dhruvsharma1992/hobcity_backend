define("add-favorite-assets-modal",["dust.core"],function(dust){dust.register("add-favorite-assets-modal",body_0);function body_0(chk,ctx){return chk.w("<div class=\"modal fade\" id=\"add_favorite_").f(ctx.get(["asset"], false),ctx,"h").w("_modal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"windowTitleLabel\" aria-hidden=\"true\"><div class=\"modal-dialog modal-lg\"><div class=\"modal-content\"><div class=\"modal-header\"><a href=\"#\" class=\"close\" data-dismiss=\"modal\">&times;</a><h4>Manage your Favorites - ").f(ctx.get(["assetName"], false),ctx,"h").w("</h4></div><div class=\"modal-body\"><div class=\"alert_placeholder\"></div><div id=\"my-tab-content\" class=\"tab-content\"><div class=\"active tab-pane\" id=\"your_").f(ctx.get(["asset"], false),ctx,"h").w("\"><i class=\"fa fa-spinner fa-spin\"></i></div></div></div><div class=\"modal-footer\"><a href=\"#\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</a></div></div></div></div>");}body_0.__dustBody=!0;return body_0;});