define("pools-list",["dust.core"],function(dust){dust.register("pools-list",body_0);function body_0(chk,ctx){return chk.x(ctx.get(["assets"], false),ctx,{"else":body_1,"block":body_7},{});}body_0.__dustBody=!0;function body_1(chk,ctx){return chk.x(ctx.get(["icmPackageDetails"], false),ctx,{"else":body_2,"block":body_3},{}).h("if",ctx,{"block":body_5},{"cond":body_6});}body_1.__dustBody=!0;function body_2(chk,ctx){return chk.w("<div class=\"mdalign\">Currently, there are no pools. </div>");}body_2.__dustBody=!0;function body_3(chk,ctx){return chk.nx(ctx.getPath(false, ["icmPackageDetails","archReviewComplete"]),ctx,{"block":body_4},{});}body_3.__dustBody=!0;function body_4(chk,ctx){return chk.w("<div class=\"mdalign\" id=\"poolListEmptyTxt\"><p class=\"text-danger\"><b>Your app must clear Arch Review before you can create a Production Pool.</b></p></div>\t");}body_4.__dustBody=!0;function body_5(chk,ctx){return chk.w("<div class=\"mdalign\" id=\"notUsingGRO\"><p class=\"text-danger\"><b>Production Pool creation is not allowed for this application as it is using a non GRO GIT Repository.</b></p></div>");}body_5.__dustBody=!0;function body_6(chk,ctx){return chk.w("'").f(ctx.get(["isGRO"], false),ctx,"h").w("' == false");}body_6.__dustBody=!0;function body_7(chk,ctx){return chk.w("<table class=\"table favlist\"><thead><tr><th width=\"25%\">Pool</th>").nx(ctx.get(["appDetail"], false),ctx,{"block":body_8},{}).w("<th width=\"15%\">Pool Type</th><th width=\"18%\">Status</th><th class=\"nosort\" width=\"10%\">Pool Health</th><th class=\"nosort\" width=\"12%\">Actions</th></tr></thead><tbody>").s(ctx.get(["assets"], false),ctx,{"block":body_9},{}).w("</tbody></table>");}body_7.__dustBody=!0;function body_8(chk,ctx){return chk.w("<th width=\"25%\">Application Name</th>");}body_8.__dustBody=!0;function body_9(chk,ctx){return chk.w("<tr><td>").x(ctx.get(["poolOverviewLink"], false),ctx,{"else":body_10,"block":body_11},{}).w("&nbsp;&nbsp;<a style=\"color:initial;\" data-toggle=\"popover\" title=\"Pool Detail\" tabindex=\"0\" role=\"button\" data-trigger=\"focus\"><i class=\"fa fa-info-circle\"></i></a><div class=\"pool-desc-container hidden\"><small>Pool ID: ").f(ctx.get(["id"], false),ctx,"h").w("</small><br/><small>App Type: ").f(ctx.get(["applicationType"], false),ctx,"h").w("</small><br/><small>PaaS Realm: ").f(ctx.get(["paasRealm"], false),ctx,"h").w("</small><br/><small>Availablity Zones: ").f(ctx.get(["availabilityZones"], false),ctx,"h").w("</small><br/><small>Owners: ").s(ctx.get(["owners"], false),ctx,{"block":body_12},{}).w("</small><br/></div></td>").nx(ctx.get(["appDetail"], false),ctx,{"block":body_14},{}).w("<td>").f(ctx.get(["paasRealm"], false),ctx,"h").w("</td><td>").h("if",ctx,{"else":body_15,"block":body_24},{"cond":body_25}).w("</td><td>\t\t\t").h("if",ctx,{"block":body_26},{"cond":body_28}).w("\t\t\t</td><td class=\"actions\"><div class=\"btn-group dropdown\">").nx(ctx.get(["isFavView"], false),ctx,{"block":body_29},{}).w("<span class=\"myfavicon\"><i class=\"fa icon-star icon-2").nx(ctx.get(["isFavorited"], false),ctx,{"block":body_40},{}).w("\" data-id=\"").f(ctx.get(["id"], false),ctx,"h").w("\" data-extra=\"").f(ctx.get(["applicationName"], false),ctx,"h").w("-").f(ctx.get(["cos"], false),ctx,"h").w("\" data-toggle=\"tooltip\" data-placement=\"top\"data-original-title=\"").s(ctx.get(["isFavorited"], false),ctx,{"else":body_41,"block":body_42},{}).w("\"></i></span></div></td></tr> ");}body_9.__dustBody=!0;function body_10(chk,ctx){return chk.f(ctx.get(["environmentName"], false),ctx,"h");}body_10.__dustBody=!0;function body_11(chk,ctx){return chk.w("<a href=\"").f(ctx.get(["poolOverviewLink"], false),ctx,"h").w("\">").f(ctx.get(["environmentName"], false),ctx,"h").w("</a>");}body_11.__dustBody=!0;function body_12(chk,ctx){return chk.f(ctx.getPath(true, []),ctx,"h").h("sep",ctx,{"block":body_13},{});}body_12.__dustBody=!0;function body_13(chk,ctx){return chk.w(", ");}body_13.__dustBody=!0;function body_14(chk,ctx){return chk.w("<td><a href=\"").f(ctx.get(["appBaseUrl"], false),ctx,"h").w("/appdetails/").f(ctx.get(["application"], false),ctx,"h").w("#poolsInfo\">").f(ctx.get(["application"], false),ctx,"h").w("</a></td>");}body_14.__dustBody=!0;function body_15(chk,ctx){return chk.w("<span class=\"label label-default").h("select",ctx,{"block":body_16},{"key":body_21}).w("\">").f(ctx.get(["statusLabel"], false),ctx,"h").h("if",ctx,{"block":body_22},{"cond":body_23}).w("</span>");}body_15.__dustBody=!0;function body_16(chk,ctx){return chk.h("eq",ctx,{"block":body_17},{"value":"SUCCESS"}).h("eq",ctx,{"block":body_18},{"value":"FAILURE"}).h("eq",ctx,{"block":body_19},{"value":"PROCESSING"}).h("default",ctx,{"block":body_20},{});}body_16.__dustBody=!0;function body_17(chk,ctx){return chk.w(" label-success");}body_17.__dustBody=!0;function body_18(chk,ctx){return chk.w(" label-danger");}body_18.__dustBody=!0;function body_19(chk,ctx){return chk.w(" label-primary");}body_19.__dustBody=!0;function body_20(chk,ctx){return chk.w(" label-primary");}body_20.__dustBody=!0;function body_21(chk,ctx){return chk.f(ctx.get(["subStatus"], false),ctx,"h");}body_21.__dustBody=!0;function body_22(chk,ctx){return chk.w("&nbsp;&nbsp;<i class=\"fa fa-cog fa-spin\"></i>");}body_22.__dustBody=!0;function body_23(chk,ctx){return chk.w("'").f(ctx.get(["subStatus"], false),ctx,"h").w("' != 'SUCCESS' && '").f(ctx.get(["subStatus"], false),ctx,"h").w("' != 'FAILURE'");}body_23.__dustBody=!0;function body_24(chk,ctx){return chk.w("<span class=\"label label-default label-warning\">PAUSED</span>&nbsp;&nbsp;<span data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"<p>Altus was not able to complete the pool &nbsp;creation after multiple retries. The pool may have been created partially. This normally &nbsp;happens when there are some issues going on in IaaS or PaaS. Please file a GPS ticket to &nbsp;get help with this issue. You can also click on 'Resume Pool Creation' in the drop-down &nbsp;menu to resume and Altus will retry to create remaining VMs and VIPs.</p>\"><i class=\"fa fa-info-circle\"></i></span></a>");}body_24.__dustBody=!0;function body_25(chk,ctx){return chk.w("'").f(ctx.get(["status"], false),ctx,"h").w("' == 'POOL_CREATION_REQUEST_STATUS' && '").f(ctx.get(["subStatus"], false),ctx,"h").w("' == 'FAILURE'");}body_25.__dustBody=!0;function body_26(chk,ctx){return chk.x(ctx.get(["sherlockWebLink"], false),ctx,{"block":body_27},{}).w("\t");}body_26.__dustBody=!0;function body_27(chk,ctx){return chk.w(" <a href=\"").f(ctx.get(["sherlockWebLink"], false),ctx,"h").w("\" target=\"popup\" onclick=\"window.open('").f(ctx.get(["sherlockWebLink"], false),ctx,"h").w("','popup','width=1200,height=700'); return false;\"><div class=\"coming-soon\">\t\t\t\t\t\t<img class=\"rotate\" src=\"").f(ctx.get(["appBaseUrl"], false),ctx,"h").w("/resources/img/sherlock.png\"></div> </a>");}body_27.__dustBody=!0;function body_28(chk,ctx){return chk.w("'").f(ctx.get(["paasRealm"], false),ctx,"h").w("' == 'Production' && '").f(ctx.get(["subStatus"], false),ctx,"h").w("' == 'SUCCESS'");}body_28.__dustBody=!0;function body_29(chk,ctx){return chk.w("<button type=\"button\" class=\"btn btn-default btn-sm dropdown-toggle\" data-toggle=\"dropdown\"><i class=\"fa fa-wrench\"></i>&nbsp;<span class=\"caret\"></span></button><ul class=\"dropdown-menu pull-right\" role=\"menu\" style=\"right: 23px;\">").h("if",ctx,{"block":body_30},{"cond":body_39}).w("</ul>");}body_29.__dustBody=!0;function body_30(chk,ctx){return chk.h("eq",ctx,{"block":body_31},{"key":ctx.get(["subStatus"], false),"value":"FAILURE"}).h("eq",ctx,{"block":body_35},{"key":ctx.get(["subStatus"], false),"value":"PAUSED"}).w("<li><a href=\"").x(ctx.get(["poolDeployLink"], false),ctx,{"else":body_36,"block":body_37},{}).w("\">Deploy</a></li><li class=\"divider\"></li>").x(ctx.get(["isAdmin"], false),ctx,{"block":body_38},{});}body_30.__dustBody=!0;function body_31(chk,ctx){return chk.h("select",ctx,{"block":body_32},{"key":ctx.get(["status"], false)});}body_31.__dustBody=!0;function body_32(chk,ctx){return chk.h("eq",ctx,{"block":body_33},{"value":"POOL_CREATION_REQUEST_STATUS"}).h("default",ctx,{"block":body_34},{});}body_32.__dustBody=!0;function body_33(chk,ctx){return chk.w("<li><a href=\"javascript:;\" data-action=\"retry-pool-creation\" data-id=\"").f(ctx.get(["id"], false),ctx,"h").w("\">Resume Pool Creation</a></li>");}body_33.__dustBody=!0;function body_34(chk,ctx){return chk.w("<li><a href=\"javascript:;\" data-action=\"retry-pool-creation\" data-id=\"").f(ctx.get(["id"], false),ctx,"h").w("\">Retry Pool Creation</a></li>");}body_34.__dustBody=!0;function body_35(chk,ctx){return chk.w("<li><a href=\"javascript:;\" data-action=\"resume-pool-creation\" data-id=\"").f(ctx.get(["id"], false),ctx,"h").w("\">Resume Pool Creation</a></li>");}body_35.__dustBody=!0;function body_36(chk,ctx){return chk.w("javascript:;");}body_36.__dustBody=!0;function body_37(chk,ctx){return chk.f(ctx.get(["poolDeployLink"], false),ctx,"h");}body_37.__dustBody=!0;function body_38(chk,ctx){return chk.w("<li><a href=\"").f(ctx.get(["appBaseUrl"], false),ctx,"h").w("/logs?assetId=").f(ctx.get(["id"], false),ctx,"h").w("&assetType=3\" target=\"_blank\">View Asset Logs</a></li>");}body_38.__dustBody=!0;function body_39(chk,ctx){return chk.w("'").f(ctx.get(["status"], false),ctx,"h").w("' != 'INITIATION'");}body_39.__dustBody=!0;function body_40(chk,ctx){return chk.w(" unfav");}body_40.__dustBody=!0;function body_41(chk,ctx){return chk.w("Add To Favorite Pools");}body_41.__dustBody=!0;function body_42(chk,ctx){return chk.w("My Favorite");}body_42.__dustBody=!0;return body_0;});