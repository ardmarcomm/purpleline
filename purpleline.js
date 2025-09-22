/*
  
   This is a utility to:
     1. Allow an editor to edit the upcoming Purple Line newsletter,
        while getting an approximation of the layout, but without having
        to worry about much HTML or dealing with iModules.
     2. Take the content the editor has generated and spit out three versions:
  			A. Email HTML for a domestic newsletter
        B. Email HTML for an international newsletter
        C. Standard HTML for a Web archive
  
 		 Data is stored locally in a global variable "content," and the data is mirrored
 		 in a purupleline.json file.

		 The Section class defines the layout for each section of the newsletter. Within each section
		 there are two sets of three functions that serve as templates for that section, for a total
		 of six: three for email, and three for the web. The "top" function renders the top of the section,
		 "item" renders each individual piece of content within the section, and "bottom" closes
		 the section.

 		 Three main functions are at work:

 		 loadData(): Gets the .json from the server and uses it to populate the DOM
 		 updateData(): Every 15 seconds, or on the click of the "save" button, take the
	 		 data from the DOM and save it in the content variable.
	 	 saveData(): Send the data from the local variable to the server.

	 	 There is also resetData, which empties the variable and updates the .json. It also
	 	 copies the .json to a back-up file, a primitive version control to protect against
	 	 accidental data loss.

		 Luke Seemann, August 2017
 */

/*
    The HTML here was updated in February 2019 to accommodate the migration to iModules Beta email.
    1. CSS styles were added.
    2. Header and footer were manually placed.
*/

/*
    This code was further updated in June 2025 to accommodate the shift to Salesforce Marketing Cloud
    and a new template design.
    1. Email HTML was replaced.
    2. Section names and data structures were updated.
    3. Email and web HTML preview functionality was added.
*/

/*
 *
 *
 *
 * Class definitions:
 *   Newsletter
 *   Section
 *   Item
 *
 *
 *
 */

let imageLeadPlaceholder = "https://image.alums.northwestern.edu/lib/fe3111747364047e7d1474/m/1/5a3a103b-5439-4d96-a3c2-0e6c38db3d94.png";
let imageSecondaryPlaceholder = "https://image.alums.northwestern.edu/lib/fe3111747364047e7d1474/m/1/99f43204-0a45-4087-93bb-1292ed8b5d7e.png"
let imageTwoColumnPlaceholder = "https://image.alums.northwestern.edu/lib/fe3111747364047e7d1474/m/1/f891bd61-8982-4aee-870c-47b7edd7a55a.png"

class Newsletter {
  constructor(config) {
    this.target = config.target;
    this.top = `
<!DOCTYPE html>
<html lang="en">

<head>
	<title>Purple Line</title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<style type="text/css">
		ReadMsgBody {
			width: 100%;
		}
		.ExternalClass {
			width: 100%;
		}
		.ExternalClass,
		.ExternalClass p,
		.ExternalClass span,
		.ExternalClass font,
		.ExternalClass td,
		.ExternalClass div {
			line-height: 100%;
		}
		body {
			-webkit-text-size-adjust: 100%;
			-ms-text-size-adjust: 100%;
			margin: 0 !important;
		}
		p {
			margin: 1em 0;
		}
		table td {
			border-collapse: collapse;
		}
		img {
			outline: 0;
		}
		a img {
			border: none;
		}
		@-ms-viewport {
			width: device-width;
		}
	</style>
	<style type="text/css">
		@media only screen and (max-width: 480px) {
			.container {
				width: 100% !important;
			}
			.footer {
				width: auto !important;
				margin-left: 0;
			}
			.mobile-hidden {
				display: none !important;
			}
			.logo {
				display: block !important;
				padding: 0 !important;
			}
			img {
				max-width: 100% !important;
				height: auto !important;
				max-height: auto !important;
			}
			.header img {
				max-width: 100% !important;
				height: auto !important;
				max-height: auto !important;
			}
			.photo img {
				width: 100% !important;
				max-width: 100% !important;
				height: auto !important;
			}
			.drop {
				display: block !important;
				width: 100% !important;
				float: left;
				clear: both;
			}
			.footerlogo {
				display: block !important;
				width: 100% !important;
				padding-top: 15px;
				float: left;
				clear: both;
			}
			.nav4,
			.nav5,
			.nav6 {
				display: none !important;
			}
			.tableBlock {
				width: 100% !important;
			}
			.responsive-td {
				width: 100% !important;
				display: block !important;
				padding: 0 !important;
			}
			.fluid,
			.fluid-centered {
				width: 100% !important;
				max-width: 100% !important;
				height: auto !important;
				margin-left: auto !important;
				margin-right: auto !important;
			}
			.fluid-centered {
				margin-left: auto !important;
				margin-right: auto !important;
			}

			/* MOBILE GLOBAL STYLES - DO NOT CHANGE */
			body {
				padding: 0px !important;
				font-size: 16px !important;
				line-height: 150% !important;
			}
			h1 {
				font-size: 22px !important;
				line-height: normal !important;
			}
			h2 {
				font-size: 20px !important;
				line-height: normal !important;
			}
			h3 {
				font-size: 18px !important;
				line-height: normal !important;
			}
			.buttonstyles {
				font-family: arial, helvetica, sans-serif !important;
				font-size: 16px !important;
				color: #FFFFFF !important;
				padding: 10px !important;
			}

			/* END OF MOBILE GLOBAL STYLES - DO NOT CHANGE */
		}

		@media only screen and (max-width: 600px) {
			.container {
				width: 100% !important;
			}
			.mobile-hidden {
				display: none !important;
			}
			.logo {
				display: block !important;
				padding: 0 !important;
			}
			.photo img {
				width: 100% !important;
				height: auto !important;
			}
			.nav5,
			.nav6 {
				display: none !important;
			}
			.fluid,
			.fluid-centered {
				width: 100% !important;
				max-width: 100% !important;
				height: auto !important;
				margin-left: auto !important;
				margin-right: auto !important;
			}
			.fluid-centered {
				margin-left: auto !important;
				margin-right: auto !important;
			}
		}
	</style>
	<!--[if mso]>       <style type="text/css">           /* Begin Outlook Font Fix */           body, table, td {               font-family: Arial, Helvetica, sans-serif ;               font-size:16px;               color:#000000;               line-height:1;           }           /* End Outlook Font Fix */       </style>     <![endif]-->
</head>

<body bgcolor="#ffffff" text="#000000"
	style="background-color: #ffffff; color: #000000; padding: 0px; -webkit-text-size-adjust:none; font-size: 16px; font-family:arial,helvetica,sans-serif;">
	<table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" role="presentation">
		<tbody>
			<tr>
				<td align="center">
					<table cellspacing="0" cellpadding="0" border="0" width="600" class="container" align="center" role="presentation">
						<tbody>
							<tr>
								<td>
									<table class="tb_properties border_style" style="background-color:#FFFFFF;" cellspacing="0"
										cellpadding="0" bgcolor="#ffffff" width="100%" role="presentation">
										<tbody>
											<tr>
												<td align="center" valign="top">
													<table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
														<tbody>
															<tr>
																<!-- added padding here -->
																<td class="content_padding" style=""><!-- end of comment -->
																	<table border="0" cellpadding="0" cellspacing="0" width="100% role="presentation"">
																		<tbody>
																			<tr>
																				<!-- top slot -->
																				<td align="center" class="header" valign="top">
																					<table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
																						<tbody>
																							<tr>
																								<td align="left" valign="top">
																									<table cellspacing="0" cellpadding="0" style="width:100%" role="presentation">
																										<tbody>
																											<tr>
																												<td class="responsive-td" valign="top" style="width: 100%;">
																													<table cellpadding="0" cellspacing="0" width="100%"
																														role="presentation" style="min-width: 100%; "
																														class="stylingblock-content-wrapper">
																														<tbody>
                                                              <tr>
																																<td class="stylingblock-content-wrapper camarker-inner" style="padding: 50px 0px 0px 25px;">
																																	<table width="100%" cellspacing="0" cellpadding="0"
																																		role="presentation">
																																		<tbody>
																																			<tr>
																																				<td align="center"><img
																																						src="https://image.alums.northwestern.edu/lib/fe3111747364047e7d1474/m/1/5bf6a3a5-b3c9-4ee5-8ea2-635356a8d78a.png"
																																						alt="Purple Line Hero" height="196"
																																						width="575"
																																						style="display: block; padding: 0; text-align: center; height: 196px; width: 575px; border: 0px;">
																																				</td>
																																			</tr>
																																		</tbody>
																																	</table>
																																</td>
																															</tr>
																														</tbody>
																													</table>
																												</td>
																											</tr>
																										</tbody>
																									</table>
																								</td>
																							</tr>
																						</tbody>
																					</table>
																				</td>
																			</tr>
																			<tr>
																				<!-- main slot -->
																				<td align="center" class="header" valign="top">
																					<table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
																						<tbody>
																							<tr>
																								<td align="left" valign="top">
																									<table cellspacing="0" cellpadding="0" style="width:100%" role="presentation">
																										<tbody>
																											<tr>
																												<td class="responsive-td" valign="top" style="width: 100%;">
																													<table cellpadding="0" cellspacing="0" width="100%"
																														role="presentation" class="stylingblock-content-wrapper"
																														style="min-width: 100%; ">
																														<tbody>
																															<tr>
																																<td class="stylingblock-content-margin-cell" style="padding: 25px 0px 45px 25px; ">
																																	<table cellpadding="0" cellspacing="0" width="100%"
																																		role="presentation"
																																		style="background-color: transparent; min-width: 100%; "
																																		class="stylingblock-content-wrapper">
																																		<tbody>
																																			<tr>
																																				<td style="padding: 0px;" class="stylingblock-content-wrapper camarker-inner">
																																					<p style="line-height: 22px; margin: 0;">
                                                                            <span style="color:#4e2a84;">
                                                                              <span style="font-size:15px;">
                                                                                <span style="font-family:Arial,Helvetica,sans-serif;">
                                                                                  <b>News for Our Northwestern Alumni Community</b>
                                                                                </span>
                                                                              </span>
                                                                            </span>
                                                                            <br>
																																						<span style="color:#4e2a84;">
                                                                              <span style="font-size:15px;">
                                                                                <span style="font-family:Arial,Helvetica,sans-serif;">
																																									%%date%%
                                                                                </span>
                                                                              </span>
                                                                            </span>
																																					</p>
																																				</td>
																																			</tr>
																																		</tbody>
																																	</table>
																																</td>
																															</tr>
																														</tbody>
																													</table>`;

    this.bottom = `
                                                          <table cellpadding="0" cellspacing="0" width="100%"
																														role="presentation" style="min-width: 100%;"
																														class="stylingblock-content-wrapper">
																														<tbody>
																															<tr>
																																<td class="stylingblock-content-wrapper camarker-inner">
																																	<table style="background-color:#4e2a84; width:100%;" width="100%" role="presentation">
																																		<tbody>
																																			<tr>
																																				<td align="center" style="width:275px; padding:50px 0px;" width="275">
                                                                          <a data-linkto="https://" href="https://click.alums.northwestern.edu/?qs=755b59f625e560c8342ebddd5084426521f25c3bfec59566c34b56bdb06b66b8c51fd97c7735575be51a10d74d5a198b8105069153382fa0">
                                                                            <img alt="Northwestern logo"
																																							src="https://image.alums.northwestern.edu/lib/fe3111747364047e7d1474/m/1/43ff4acc-da82-4721-a8bb-42093362fbd9.png"
																																							style="width:275px;" width="275">
																																					</a></td>
																																			</tr>
																																		</tbody>
																																	</table>
																																</td>
																															</tr>
																														</tbody>
																													</table>
																													<table cellpadding="0" cellspacing="0" width="100%"
																														role="presentation"
																														style="background-color: #401F68; min-width: 100%; "
																														class="stylingblock-content-wrapper">
																														<tbody>
																															<tr>
																																<td style="padding:15px 0px;" class="stylingblock-content-wrapper camarker-inner">
																																	<table role="presentation" align="center">
																																		<tbody>
																																			<tr>
																																				<td align="center"><a
																																						style="font-weight:normal;color:#4E2A84;text-decoration:underline;line-height:100%;"
																																						href="https://click.alums.northwestern.edu/?qs=755b59f625e560c84555d68c66a815c14bdacec1a5b53e15801e2007b5840c0c178940d1e749759855bcc187be85a3952de5f2ab0337608c"><img
																																							src="https://image.alums.northwestern.edu/lib/fe3111747364047e7d1474/m/1/db0c983b-d2ef-4012-89d1-93f113fd6ef1.png"
																																							alt="Facebook social icon"
																																							style="height:30px;" data-assetid="62968">
																																					</a></td>
																																				<td><a
																																						style="font-weight:normal;color:#4E2A84;text-decoration:underline;line-height:100%;"
																																						href="https://click.alums.northwestern.edu/?qs=755b59f625e560c820e2804ce255fadf66e97a487aedd22a8d77ed018b9360a601bf46de8d7077f1c3b63f00005836f0ac04c52d5767b31b"><img
																																							src="https://image.alums.northwestern.edu/lib/fe3111747364047e7d1474/m/1/0aa151e1-2f81-4a70-87c7-24b0a41792e2.png"
																																							alt="Instagram social icon"
																																							style="height:30px;" data-assetid="62966">
																																					</a></td>
																																				<td><a
																																						style="font-weight:normal;color:#4E2A84;text-decoration:underline;line-height:100%;"
																																						href="https://click.alums.northwestern.edu/?qs=755b59f625e560c8a96a4cfe2d4166afa891015c9f24b5a183044c318015c502d852dc985fa1d100794fc2f6ec1fb09dd84c3206b3057b13"><img
																																							src="https://image.alums.northwestern.edu/lib/fe3111747364047e7d1474/m/1/af4fb0f0-2640-4363-8aab-de2f3aba9d81.png"
																																							alt="X social icon" style="height:30px;"
																																							data-assetid="62969">
																																					</a></td>
																																				<td><a
																																						style="font-weight:normal;color:#4E2A84;text-decoration:underline;line-height:100%;"
																																						href="https://click.alums.northwestern.edu/?qs=755b59f625e560c8ed2ed9f60dfbdc256224bad3dde1efe6fdcb28771413580763f972b27d9f34a9962afd0bc6d610405c60306052ac7980"><img
																																							src="https://image.alums.northwestern.edu/lib/fe3111747364047e7d1474/m/1/9888ce1f-cd5b-4de8-9c10-59f2b09000a8.png"
																																							alt="Linkedin social icon"
																																							style="height:30px;" data-assetid="62967">
																																					</a></td>
																																			</tr>
																																		</tbody>
																																	</table>
																																</td>
																															</tr>
																														</tbody>
																													</table>
																												</td>
																											</tr>
																										</tbody>
																									</table>
																								</td>
																							</tr>
																						</tbody>
																					</table>
																				</td>
																			</tr>
																		</tbody>
																	</table>
																</td>
															</tr>
														</tbody>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
			<tr>
				<td valign="top"></td>
			</tr>
		</tbody>
	</table>
</body>
</html>`
  }  


  get render() {
    let output = "";
    output += this.top.replace("%%date%%", formattedPubDate())
    content.sections.forEach((section) => {
      output += section.renderEmail(this.target);
    });
    output += this.bottom;

    return output;
  }

  get renderWeb() {
    let output = "";
    content.sections.forEach((section) => {
      output += section.renderWeb();
    });
    return output;
  }
}

class Section {
  constructor(name, templates) {
    this.name = name;
    this.items = [];
    this.templates = {
      email: templates.email || {
        top: function () {
          return "";
        },
        item: function () {
          return "";
        },
        divider: function () {
          return "";
        },
        bottom: function () {
          return "";
        },
      },
      web: templates.web || {
        top: function () {
          return "";
        },
        item: function () {
          return "";
        },
        divider: function () {
          return "";
        },
        bottom: function () {
          return "";
        },
      },
    };
  }

  renderEmail(target) {
    let sorteditems,
      output = "";

    sorteditems = this.items.filter((item) => {
      return item[target] > 0 && item[target] != "" && item.headline.length > 0;
    });

    sorteditems.sort(function (a, b) {
      return a[target] - b[target];
    });

    if (sorteditems.length > 0) {
      output += this.templates.email.top(sorteditems[0], target);
      sorteditems.forEach((item, index) => {
        output += this.templates.email.item(item, target);
        if (index < sorteditems.length - 1) {
          output += this.templates.email.divider();
        } 
      });
      output += this.templates.email.bottom();
    }

    return output;
  }

  renderWeb() {
    let sorteditems,
      output = "";

    sorteditems = this.items.filter((item) => {
      return (
        item["domestic"] > 0 &&
        item["domestic"] != "" &&
        item.headline.length > 0
      );
    });

    sorteditems.sort(function (a, b) {
      return a["domestic"] - b["domestic"];
    });

    if (sorteditems.length > 0) {
      output += this.templates.web.top(sorteditems[0]);
      sorteditems.forEach((item, index) => {
        output += this.templates.web.item(item);
        if (index < sorteditems.length - 1) {
          output += this.templates.web.divider();
        } 
      });
      output += this.templates.web.bottom();
    }

    return output;
  }
}

class Item {
  constructor(config) {
    this.headline = config.headline || "";
    this.url = config.url || "";
    this.domestic = config.domestic || 0; // A number indicating priority. 1 is top, null is to not include.
    this.international = config.international || 0;
    this.cta = config.cta || "";
    this.body = config.body || "";
    this.date = config.date || "";
    this.dateInternational = config.dateInternational || "";
    this.imageSrc = config.imageSrc || "";
    this.imageAlt = config.imageAlt || "";
  }

  utmify(utm_content, target) {
    let output = this.url.indexOf("?") > -1 ? this.url + "&" : this.url + "?";
    output +=
      output.indexOf("utm_medium") > -1
        ? ""
        : `utm_medium=${encodeURIComponent(medium)}`;
    output +=
      output.indexOf("utm_source") > -1
        ? ""
        : `&utm_source=${encodeURIComponent(source)}`;
    output +=
      output.indexOf("utm_campaign") > -1
        ? ""
        : `&utm_campaign=${encodeURIComponent(
            content.date + " Purple Line " + target
          )}`;

    // As of March 2018, stop using utm_content to segregate photo vs. headline vs button clicks
    if (output.indexOf("utm_content") < 0 && utm_content) {
      output += `&utm_content=${encodeURIComponent(utm_content)}`;
    }
    return output;
  }
}

/*
 *
 *
 *
 * Bind functions to keystrokes, button clicks, and other events.
 *
 *
 *
 */

// With each keystroke in an input, update the data
$(".item textarea, .item input").on("change paste keyup", function (e) {
  updateData();
  changed = true;
  markUnsaved();
});

// Save on command-s
$(window).keydown(function (e) {
  if ((e.metaKey || e.ctrlKey) && e.keyCode == 83) {
    /*ctrl+s or command+s*/
    markSaving();
    updateData();
    saveData();
    e.preventDefault();
    return false;
  }
});

// Save every 15 seconds
setInterval(function () {
  if (changed) {
    saveData();
    changed = false;
  }
}, 15000);

// Save on closing a window
window.onbeforeunload = saveData;

// Button binding
$("button#save").on("click", function () {
  markSaving();
  updateData();
  saveData();
});

$("button#reset").on("click", function () {
  $("button#reset-cancel").slideDown();
  $("button#reset-confirm").slideDown();
});

$("button#reset-confirm").on("click", function () {
  resetData();

  $("input, textarea").val("");

  $(".item-collection").each(function () {
    let counter = 1;
    $(this)
      .children(".item")
      .each(function () {
        $(this).find(".domestic, .international").val(counter);
        counter += 1;
      });
  });
  updateData();
  saveData();
  markSaved();
  $(this).hide();
  $("#reset-cancel").hide();
});

$("button#reset-cancel").on("click", function () {
  $("button#reset-confirm").hide();
  $(this).hide();
});

$("button#show-results").on("click", function () {
  renderNewsletters(newsletters);
  $(this).hide();
  $("#show-entry").show();
  $("#entry").hide();
  $("textarea");
  $("#results").css("display", "block");
  autosize.update($("textarea"));
});

$("button#show-entry").on("click", function () {
  $(this).hide();
  $("#show-results").show();
  $("#results").hide();
  $("#entry").show();
});

$("button.show-element").on("click", function () {
  $(this).hide();
  $(this).next(".hide-until-shown").slideDown();
});

$("#preview-domestic-email").on("click", function () {
  previewEmail("domestic");
});

$("#preview-international-email").on("click", function () {
  previewEmail("international");
});

$("#preview-web").on("click", function () {
  previewWeb();
});

/*
 *
 *
 *
 * Extend the String prototype to help modify headlines and other blocks of type
 *
 *
 *
 */

String.prototype.clean = function () {
  // Convert newlines to breaks
  let output = this.replace(/(?:\r\n|\r|\n)/g, "<br />");

  // Add UTM codes to any links
  var link_re = /href="[^"]*(?:alumni\.northwestern|secure\.ard\.northwestern|wewill\.northwestern|our\.northwestern)[^"]*/gi;
  output = output.replace(link_re, function (match) {
    if (match.indexOf("utm_medium") < 0) {
      match = check_for_query(match);
    }
    match +=
      match.indexOf("utm_medium") > -1
        ? ""
        : `utm_medium=${encodeURIComponent(medium)}`;
    match +=
      match.indexOf("utm_source") > -1
        ? ""
        : `&utm_source=${encodeURIComponent(source)}`;
    match +=
      match.indexOf("utm_campaign") > -1
        ? ""
        : `&utm_campaign=${encodeURIComponent(content.date + " Purple Line")}`;

    return match;
  });
  return output;
};

function check_for_query(url) {
  return url.indexOf("?") > -1 ? url + "&" : url + "?";
}

/*
 *
 *
 *
 * Utility functions, mostly to interact with the server.
 *
 *
 *
 */

// Scan all the inputs and update the local content variable.
function updateData() {
  content.date = $("#pl-date").val();
  content.subject = $("#pl-subject").val();
  content.subjectInternational = $("#pl-subject-international").val();
  content.preheader = $("#pl-preheader").val();
  content.preheaderInternational = $("#pl-preheader-international").val();
  content.imageLead = $("#pl-image-lead").val();
  content.imageLeadAlt = $("#pl-image-lead-alt").val();
  content.imageSecondary = $("#pl-image-secondary").val();
  content.imageSecondaryAlt = $("#pl-image-secondary-alt").val();

  // Clear the current content
  content.sections.forEach((section) => (section.items = []));

  // For every item in the form, grab its data, create an Item object, and add it to the correct section list
  $(".item").each(function () {
    let config = {};
    $(this)
      .find("input, textarea")
      .each(function () {
        config[$(this).attr("name")] = $(this).val();
      });

    let itemtype = $(this).data("type");
    content.sections.forEach((section) => {
      if (section.name == itemtype) {
        section.items.push(new Item(config));
      }
    });
  });
}

// Send the data to the server.
function saveData() {
  if (window.location.href.indexOf("safety") < 0) {
    $.post("save.php", JSON.stringify(content), function (r) {
      const response = JSON.parse(r);
      if (response.success == false) {
        alert("Save failed. " + response.message);
      }
    })
      .done(function () {
        markSaved();
      })
      .fail(function (xhr, status, error) {
        alert("Save failed for unknown reason.");
      });
  } else {
    console.log("Save failed. In safety mode!");
  }
}

// Retrieve data from the server
function loadData() {
  $.get("purpleline.json", function (response) {
    $("#pl-date").val(response.date);
    $("#pl-subject").val(response.subject);
    $("#pl-subject-international").val(response.subjectInternational);
    $("#pl-preheader").val(response.preheader);
    $("#pl-preheader-international").val(response.preheaderInternational);
    $("#pl-image-lead").val(response.imageLead);
    $("#pl-image-lead-alt").val(response.imageLeadAlt);
    $("#pl-image-secondary").val(response.imageSecondary);
    $("#pl-image-secondary-alt").val(response.imageSecondaryAlt);

    response.sections.forEach((section) => {
      // For each item in each nth section, update the corresponding input in the nth .item of that type.
      for (var i = 0; i < section.items.length; i++) {
        const item = section.items[i];
        let target = $("." + section.name.replace("items", "item")).eq(i);
        target.find("input, textarea").each(function () {
          $(this).val(item[$(this).attr("name")]);
        });
      }
    });

    $("textarea").trigger("input"); // Resizes the textareas
    updateData();
  }).done(function () {
    autosize.update($("textarea"));
  });
}

// Send content to server so it can back-up the last version (and only the last version)
function resetData() {
  $.post("reset.php", JSON.stringify(content), function (r) {
    response = JSON.parse(r);
    if (response.success == false) {
      alert("Reset failed. " + response.message);
    }
  });
}

function renderNewsletters(newsletters) {
  newsletters.forEach((newsletter) => {
    $("#results-" + newsletter.target).val(newsletter.render);
    if (newsletter.target == "domestic") {
      $("#results-web").val(newsletter.renderWeb);
    }
  });
}

function markSaving() {
  $("button#save").html("Saving …");
}

function markSaved() {
  $("button#save").html("saved").addClass("saved");
}

function markUnsaved() {
  $("button#save").html("save").removeClass("saved");
}

// Renders the generated email HTML in a new window
function previewEmail(target) {
  const htmlContent = $(`#results-${target}`).val();
  const previewWindow = window.open('', '_blank');
  previewWindow.document.write(htmlContent);
  previewWindow.document.close();
}

// Renders the generated web HTML (wrapped in NU boilerplate) in a new window
function previewWeb() {
  const top = `
<head>
  <link href="https://alumni.northwestern.edu/_files/css/vendor.css" media="screen" rel="stylesheet">
  <link href="https://alumni.northwestern.edu/_files/css/style.css" id="MainStyle" rel="stylesheet">
  <link href="https://alumni.northwestern.edu/_files/css/overwrite-2017.css" rel="stylesheet">
  <link href="https://alumni.northwestern.edu/_files/css/hh-module.css" rel="stylesheet">
  <link href="https://alumni.northwestern.edu/_files/css/hh-custom.css" rel="stylesheet">
  <link href="https://assets.ard.northwestern.edu/css/purpleline.css" rel="stylesheet">
</head>
<body>
  <div class="section hh-news hh-module">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="section-row wysiwyg">
            <div style="width: 600px; margin: 0 auto;">`

  const bottom = `
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>`

  const htmlContent = top + $(`#results-web`).val() + bottom;
  const previewWindow = window.open('', '_blank');
  previewWindow.document.write(htmlContent);
  previewWindow.document.close();
}

// Returns month and year from input field, i.e. "July 17, 2025"
function formattedPubDate() {
  const dateString = $("#pl-date").val(); // "2025-09-17"
  const [year, month, day] = dateString.split('-');
  // Parse date as local time instead of as UTC to prevent accidentally incorrect day
  const publicationDate = new Date(year, month - 1, day); // month is 0-indexed

  if (!isNaN(publicationDate.getTime())) {
    const formattedDate = publicationDate.toLocaleDateString('en-us', { day: "numeric", month:"long", year:"numeric" });
    return formattedDate;
  } else {
    // Return an empty string if date is invalid or input field is empty
    return "";
  }
}

/*
 *
 *
 *
 * Define sections and create their templates (as functions)
 *
 *
 *
 */

let newsitems = new Section("newsitems", {
  email: {
    top: (item, target) => `
<!-- BLOCK: Lead image -->
<table cellpadding="0" cellspacing="0" width="100%"
  role="presentation" class="stylingblock-content-wrapper"
  style="min-width: 100%; ">
  <tbody>
    <tr>
      <td class="stylingblock-content-margin-cell" style="padding: 0px 0px 40px; ">
        <table cellpadding="0" cellspacing="0" width="100%"
          role="presentation"
          style="background-color: transparent; min-width: 100%; "
          class="stylingblock-content-wrapper">
          <tbody>
            <tr>
              <td style="padding: 0px;" class="stylingblock-content-wrapper camarker-inner">
                <table width="100%" cellspacing="0" cellpadding="0" role="presentation">
                  <tbody>
                    <tr>
                      <td align="center"><a
                          href="${item.utmify("photo", target)}"
                          data-linkto="https://"><img
                            data-assetid="81787"
                            src="${
                              content.imageLead
                                ? content.imageLead
                                : imageLeadPlaceholder
                            }"
                            alt="${
                              content.imageLeadAlt
                                ? content.imageLeadAlt
                                : ""
                            }" 
                            height="375"
                            width="600"
                            style="display: block; padding: 0px; text-align: center; height: 375px; width: 600px; border: 0px;"></a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`,

    item: (item, target) => `
<!-- BLOCK: Story headline -->
<table cellpadding="0" cellspacing="0" width="100%"
  role="presentation" class="stylingblock-content-wrapper"
  style="min-width: 100%; ">
  <tbody>
    <tr>
      <td class="stylingblock-content-margin-cell" style="padding: 0px 25px 0px 25px;">
        <table cellpadding="0" cellspacing="0" width="100%"
          role="presentation"
          style="background-color: transparent; min-width: 100%;"
          class="stylingblock-content-wrapper">
          <tbody>
            <tr>
              <td style="padding: 0px;" class="stylingblock-content-wrapper camarker-inner">
                <p class="no-hyphenation" style="mso-line-height-rule:exactly; line-height: 36px; margin: 0 0 10px 0;">
                  <span style="color:#4e2a84;">
                    <span style="font-size:30px;">
                      <span style="font-family:Arial,Helvetica,sans-serif;">
                        <b><a
                            data-linkto="https://"
                            href="${item.utmify("headline", target)}"
                            style="color:#4e2a84;text-decoration:none;">
                            ${item.headline.clean()}
                        </a></b>
                      </span>
                    </span>
                  </span>
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>

<!-- BLOCK: Story graf -->
<table cellpadding="0" cellspacing="0" width="100%"
  role="presentation" class="stylingblock-content-wrapper"
  style="min-width: 100%; ">
  <tbody>
    <tr>
      <td class="stylingblock-content-margin-cell" style="padding: 0px 25px 27px 25px;">
        <table cellpadding="0" cellspacing="0" width="100%"
          role="presentation"
          style="background-color: transparent; min-width: 100%; "
          class="stylingblock-content-wrapper">
          <tbody>
            <tr>
              <td style="padding: 0px;" class="stylingblock-content-wrapper camarker-inner">
                <div class="no-hyphenation" style="mso-line-height-rule:exactly; line-height: 150%; font-size: 18px; font-family: Arial, Helvetica, sans-serif;">
                  ${item.body.clean()}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>

<!-- BLOCK: Story CTA button -->
<table cellpadding="0" cellspacing="0" width="100%"
  role="presentation" class="stylingblock-content-wrapper"
  style="min-width: 100%; ">
  <tbody>
    <tr>
      <td class="stylingblock-content-margin-cell" style="padding: 0px 0px 50px 25px;">
        <table cellpadding="0" cellspacing="0" width="100%"
          role="presentation"
          style="background-color: transparent; min-width: 100%; "
          class="stylingblock-content-wrapper">
          <tbody>
            <tr>
              <td style="padding: 0px;" class="stylingblock-content-wrapper camarker-inner">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation" style="width:100%;">
                  <tbody>
                    <tr>
                      <td align="left">
                        <table border="0" cellspacing="0" cellpadding="0" role="presentation">
                          <tbody>
                            <tr>
                              <td class="innertd buttonblock" bgcolor="#4e2a84" style="border-radius: 0px; -moz-border-radius: 0px; -webkit-border-radius: 3px; color: #FFFFFF; background-color: #4e2a84;">
                                <a target="_blank"
                                  class="buttonstyles"
                                  style="width: 200px; font-size: 16px; font-family: Arial, helvetica, sans-serif; color: #FFFFFF; text-align: center; text-decoration: none; display: block; line-height: 100%; background-color: #4e2a84; border: 1px solid #4e2a84; padding: 10px; border-radius: 0px; -moz-border-radius: 3px; -webkit-border-radius: 0px;"
                                  href="${item.utmify("button", target)}"
                                  data-linkto="https://"><b>
                                  ${item.cta.clean()}</b></a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`,

    divider: () => `
<!-- BLOCK: Divider -->
<table cellpadding="0" cellspacing="0" width="100%" role="presentation" class="stylingblock-content-wrapper" style="min-width: 100%;">
  <tbody>
    <tr>
      <td class="stylingblock-content-margin-cell" style="padding: 0px 25px 40px 25px;">
        <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: transparent; min-width: 100%;" class="stylingblock-content-wrapper">
          <tbody>
            <tr>
              <td style="padding: 0px;" class="stylingblock-content-wrapper camarker-inner">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0;">
                  <tbody>
                    <tr>
                      <td style="border-top: 1px solid #808080; width: 100%; background-color: #808080; font-size: 0; line-height: 0; mso-line-height-rule: exactly;">&nbsp;</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`,

    bottom: () => `
<!-- BLOCK: 25px Spacer -->
<table cellpadding="0" cellspacing="0" width="100%" role="presentation" class="stylingblock-content-wrapper" style="min-width: 100%; ">
  <tbody>
    <tr>
      <td class="stylingblock-content-margin-cell" style="padding: 0px 0px 25px 0px; ">
      </td>
    </tr>
  </tbody>
</table>`,
  }, // End newsitems section email template

  web: {
    top: () => `
<p class="note">The <em>Purple Line</em> newsletter brings you top stories from Northwestern, ways to stay connected, upcoming events, and more. Ensure that you receive the monthly email by <a href="https://our.northwestern.edu/ascendportal/s/">updating your information</a> with us.</p>
<figure class="logo">
  <img data-assetid="66244"
    src="https://image.alums.northwestern.edu/lib/fe3111747364047e7d1474/m/1/ba67cb5b-1eff-4b98-9153-d59291344ab2.png"
    alt="Purple Line Hero" 
    width="100%">
</figure>
<p>News for Our Northwestern Alumni Community</p>
<p class="pl-date">${formattedPubDate()}</p>
<figure>
  <img src="${content.imageLead}" width="600" alt="${content.imageLeadAlt}">
</figure>`,
    item: (item) => `
<article>
	<h3>
		<a href="${item.url}">${item.headline}</a>
	</h3>
	<p>${item.body}</p>
	<p><a href="${item.url}" class="button">${item.cta}</a></p>
</article>
`,
    divider: () => `<hr style="margin: 50px 0; border: .5px solid rgb(128 128 128);">`,
    bottom: () => ``,
  }, // End newsitems section web template
});

let briefitems = new Section("briefitems", {
  email: {
    top: () => `
<!-- BLOCK: News in Brief section head -->
<table cellpadding="0" cellspacing="0" width="100%"
  role="presentation" class="stylingblock-content-wrapper"
  style="min-width: 100%; ">
  <tbody>
    <tr>
      <td class="stylingblock-content-margin-cell" style="padding: 0px 0px 20px 25px;">
        <table cellpadding="0" cellspacing="0" width="100%"
          role="presentation"
          style="background-color: transparent; min-width: 100%; "
          class="stylingblock-content-wrapper">
          <tbody>
            <tr>
              <td style="padding: 0px;" class="stylingblock-content-wrapper camarker-inner">
                <div style="mso-line-height-rule:exactly; line-height: 1; margin-bottom:0px; padding-bottom:0px; font-size:36px; color:#4e2a84; font-family:Arial,Helvetica,sans-serif;">
                  NEWS IN BRIEF</div>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
<table cellpadding="0" cellspacing="0" width="100%"
  role="presentation"
  style="background-color: transparent; min-width: 100%; "
  class="stylingblock-content-wrapper">
  <tbody>
    <tr>
      <td style="padding: 0px;" class="stylingblock-content-wrapper camarker-inner">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0;">
          <tbody>
            <tr>
              <td style="height: 6px; background-color: #4e2a84; font-size: 0; line-height: 0;">&nbsp;</td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>

<!-- BLOCK: News in Brief table -->
<table cellpadding="0" cellspacing="0" role="presentation" style="border-collapse: collapse;">
  <tbody>
    <tr>
      <td style="padding:40px 40px 40px 25px;">
				<table cellpadding="0" cellspacing="0" role="presentation" style="border-collapse: collapse;">        
          <tbody>`,

    item: (item, target) => `
<!-- BLOCK: News in Brief story -->
<tr>
  <td style="padding: 0 0 30px 0; font-size:18px; line-height:28px; color:#4e2a84;">→</td>
  <td style="padding: 0 0 30px 25px;"><a
      data-linkto="https://"
      href="${item.utmify("headline", target)}"
      style="color:#4E2A84; text-decoration: underline; font-weight:normal; font-size:22px; line-height:28px;">
      ${item.headline.clean()}
      </a></td>
</tr>`,

    divider: () => ``,
    bottom: () => `
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`
    }, // End briefitems section email template

  web: {
    top: (item) => `<h2 style="margin-top: 50px;">News in Brief</h2>`,
    item: (item) => `
<article>
  <div>→</div>
  <div>
    <a data-linkto="https://" href="${item.url}">${item.headline.clean()}</a>
  </div>
</article>
    `,
    divider: () => ``,
    bottom: () => ``,
  }, // End briefitems section web template
});

let actionitems = new Section("actionitems", {
  email: {
    top: (item, target) => `
<!-- BLOCK: Alumni in Action section head -->
<table cellpadding="0" cellspacing="0" width="100%"
  role="presentation" class="stylingblock-content-wrapper"
  style="min-width: 100%; ">
  <tbody>
    <tr>
      <td class="stylingblock-content-margin-cell" style="padding: 0px 0px 20px 25px;">
        <table cellpadding="0" cellspacing="0" width="100%"
          role="presentation"
          style="background-color: transparent; min-width: 100%; "
          class="stylingblock-content-wrapper">
          <tbody>
            <tr>
              <td style="padding: 0px;" class="stylingblock-content-wrapper camarker-inner">
                <div style="mso-line-height-rule:exactly; line-height: 1; margin-bottom:0px; padding-bottom:0px; font-size:36px; color:#4e2a84; font-family:Arial,Helvetica,sans-serif;">
                  ALUMNI IN ACTION</div>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
<table cellpadding="0" cellspacing="0" width="100%"
  role="presentation" class="stylingblock-content-wrapper"
  style="min-width: 100%; ">
  <tbody>
    <tr>
      <td class="stylingblock-content-margin-cell" style="padding: 0px 0px 40px;">
        <table cellpadding="0" cellspacing="0" width="100%"
          role="presentation"
          style="background-color: transparent; min-width: 100%; "
          class="stylingblock-content-wrapper">
          <tbody>
            <tr>
              <td style="padding: 0px;" class="stylingblock-content-wrapper camarker-inner">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0;">
                  <tr>
                    <td style="height: 6px; background-color: #4e2a84; font-size: 0; line-height: 0;">&nbsp;</td>
                  </tr>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>

<!-- BLOCK: Alumni in Action Photo -->
<table cellpadding="0" cellspacing="0" width="100%"
  role="presentation" class="stylingblock-content-wrapper"
  style="min-width: 100%; ">
  <tbody>
    <tr>
      <td class="stylingblock-content-margin-cell" style="padding: 0px 0px 40px;">
        <table cellpadding="0" cellspacing="0" width="100%"
          role="presentation"
          style="background-color: transparent; min-width: 100%; "
          class="stylingblock-content-wrapper">
          <tbody>
            <tr>
              <td style="padding: 0px;" class="stylingblock-content-wrapper camarker-inner">
                <table width="100%" cellspacing="0" cellpadding="0" role="presentation">
                  <tbody>
                    <tr>
                      <td align="center"><a
                          href="${item.utmify("photo", target)}"
                          data-linkto="http://"><img
                            data-assetid="81657"
                            src="${
                              content.imageSecondary
                                ? content.imageSecondary
                                : imageSecondaryPlaceholder
                            }"
                            alt="${
                              content.imageSecondaryAlt
                                ? content.imageSecondaryAlt
                                : ""
                            }"
                            height="350" width="550"
                            style="display: block; padding: 0px; text-align: center; height: 350px; width: 550px; border: 0px;"></a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`,

    item: (item, target) => `
<!-- BLOCK: Alumni in Action Headline -->
<table cellpadding="0" cellspacing="0" width="100%"
  role="presentation" class="stylingblock-content-wrapper"
  style="min-width: 100%; ">
  <tbody>
    <tr>
      <td class="stylingblock-content-margin-cell" style="padding: 0px 25px 0px 25px;">
        <table cellpadding="0" cellspacing="0" width="100%"
          role="presentation"
          style="background-color: transparent; min-width: 100%; "
          class="stylingblock-content-wrapper">
          <tbody>
            <tr>
              <td style="padding: 0px;" class="stylingblock-content-wrapper camarker-inner">
                <p class="no-hyphenation" style="mso-line-height-rule:exactly; line-height: 36px; margin: 0 0 10px 0;">
                  <span style="color:#4e2a84;">
                    <span style="font-size:30px;">
                      <span style="font-family:Arial,Helvetica,sans-serif;">
                        <b><a
                            data-linkto="https://"
                            href="${item.utmify("headline", target)}"
                            style="color:#4e2a84;text-decoration:none;">
                            ${item.headline.clean()}
                        </a></b>
                      </span>
                    </span>
                  </span>
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>

<!-- BLOCK: Alumni in Action Story -->
<table cellpadding="0" cellspacing="0" width="100%"
  role="presentation" class="stylingblock-content-wrapper"
  style="min-width: 100%; ">
  <tbody>
    <tr>
      <td class="stylingblock-content-margin-cell" style="padding: 0px 25px 27px 25px;">
        <table cellpadding="0" cellspacing="0" width="100%"
          role="presentation"
          style="background-color: transparent; min-width: 100%; "
          class="stylingblock-content-wrapper">
          <tbody>
            <tr>
              <td style="padding: 0px;" class="stylingblock-content-wrapper camarker-inner">
                <div class="no-hyphenation" style="mso-line-height-rule:exactly; line-height: 150%; font-size: 18px; font-family: Arial, Helvetica, sans-serif;">
                  ${item.body.clean()}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>

<!-- BLOCK: Alumni In Action CTA -->
<table cellpadding="0" cellspacing="0" width="100%"
  role="presentation" class="stylingblock-content-wrapper"
  style="min-width: 100%; ">
  <tbody>
    <tr>
      <td class="stylingblock-content-margin-cell" style="padding: 0px 0px 50px 25px;">
        <table cellpadding="0" cellspacing="0" width="100%"
          role="presentation"
          style="background-color: transparent; min-width: 100%; "
          class="stylingblock-content-wrapper">
          <tbody>
            <tr>
              <td style="padding: 0px;" class="stylingblock-content-wrapper camarker-inner">
                <table width="100%" border="0" cellspacing="0"
                  cellpadding="0" role="presentation"
                  style="width:100%;">
                  <tbody>
                    <tr>
                      <td align="left">
                        <table border="0" cellspacing="0" cellpadding="0" role="presentation">
                          <tbody>
                            <tr>
                              <td class="innertd buttonblock" bgcolor="#4e2a84" style="border-radius: 0px; -moz-border-radius: 0px; -webkit-border-radius: 3px; color: #FFFFFF; background-color: #4e2a84;">
                                <a target="_blank"
                                  class="buttonstyles"
                                  style="width: 200px; font-size: 16px; font-family: Arial, helvetica, sans-serif; color: #FFFFFF; text-align: center; text-decoration: none; display: block; line-height: 100%; background-color: #4e2a84; border: 1px solid #4e2a84; padding: 10px; border-radius: 0px; -moz-border-radius: 3px; -webkit-border-radius: 0px;"
                                  href="${item.utmify("button", target)}"
                                  data-linkto="https://">
                                  <b>${item.cta.clean()}</b>
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`,

    divider: () => ``,
    bottom: () => ``
  }, // End actionitems section email template

  web: {
    top: () => `
<h2 style="margin-top: 50px;">Alumni in Action</h2>
<figure>
	<img src="${content.imageSecondary}" alt="${content.imageSecondaryAlt}">
</figure>`,

    item: (item) => `
<article>
	<h3>
		<a href="${item.url}">${item.headline}</a>
	</h3>
	<p>${item.body}</p>
	<p><a href="${item.url}" class="button">${item.cta}</a></p>
</article>
		`,
    divider: () => ``,
    bottom: () => ``,
  }, // End actionitems section web template
});

let twocolumnitems = new Section("twocolumnitems", {
  email: {
    top: (item, target) => `
<table cellpadding="0" cellspacing="0" width="100%"
  role="presentation" class="stylingblock-content-wrapper"
  style="min-width: 100%; ">
  <tbody>
    <tr>
      <td class="stylingblock-content-margin-cell" style="padding: 0px 25px 50px;">
        <table cellpadding="0" cellspacing="0" width="100%"
          role="presentation"
          style="background-color: transparent; min-width: 100%;"
          class="stylingblock-content-wrapper">
          <tbody>
            <tr>
              <td style="padding: 0px;" class="stylingblock-content-wrapper camarker-inner">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0;">
                  <tr>
                    <td style="border-top: 1px solid #808080; width: 100%; background-color: #808080; font-size: 0; line-height: 0; mso-line-height-rule: exactly;">&nbsp;</td>
                  </tr>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`,

    item: (item, target) => `
<!-- BLOCK: 2-column story with photo -->
<table cellpadding="0" cellspacing="0" width="100%"
  role="presentation" style="min-width: 100%; "
  class="stylingblock-content-wrapper">
  <tbody>
    <tr>
      <td style="padding: 0 25px;" class="stylingblock-content-wrapper camarker-inner">
        <table cellspacing="0" cellpadding="0"
          role="presentation" style="width: 100%;">
          <tbody>
            <tr>
              <td>
                <table cellspacing="0" cellpadding="0" role="presentation" style="width: 100%;">
                  <tbody>
                    <tr>
                      <td valign="top" class="responsive-td" style="width: 45%; padding-right: 25px;">
                        <table cellpadding="0" cellspacing="0"
                          width="100%" role="presentation"
                          style="min-width: 100%; "
                          class="stylingblock-content-wrapper">
                          <tbody>
                            <tr>
                              <td class="stylingblock-content-wrapper camarker-inner">
                                <table width="100%" cellspacing="0" cellpadding="0" role="presentation">
                                  <tbody>
                                    <tr>
                                      <td align="left" style="padding-bottom:15px;"><a
                                          href="${item.utmify("photo", target)}"
                                          data-linkto="http://"><img
                                            data-assetid="78589"
                                            src="${
                                              item.imageSrc
                                                ? item.imageSrc
                                                : imageTwoColumnPlaceholder
                                            }"
                                            alt="${
                                              item.imageAlt
                                                ? item.imageAlt
                                                : ""
                                            }"
                                            height="220"
                                            width="220"
                                            style="display: block; padding: 0px; text-align: center; height: 220px; width: 220px; border: 0px;"></a>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                      <!-- Right column -->
                      <td valign="top" class="responsive-td" style="width: 55%; padding: 0;">
                        <table cellpadding="0" cellspacing="0"
                          width="100%" role="presentation"
                          class="stylingblock-content-wrapper"
                          style="min-width: 100%; ">
                          <tbody>
                            <tr>
                              <td class="stylingblock-content-margin-cell" style="padding: 0px;">
                                <table cellpadding="0"
                                  cellspacing="0" width="100%"
                                  role="presentation"
                                  style="background-color: transparent; min-width: 100%; "
                                  class="stylingblock-content-wrapper">
                                  <tbody>
                                    <tr>
                                      <td style="padding: 0px;" class="stylingblock-content-wrapper camarker-inner">
                                        <p style="font-family:Arial,Helvetica,sans-serif; font-weight:bold; font-size:22px; line-height:28px; color:#4e2a84; margin: 8px 0 3px 0;">
                                          <a
                                            data-linkto="https://"
                                            href="${item.utmify("headline", target)}"
                                            style="color:#4e2a84;text-decoration:none;">
                                            ${item.headline.clean()}
                                          </a>
                                        </p>
                                        <div class="no-hyphenation" style="mso-line-height-rule:exactly; font-family:Arial,Helvetica,sans-serif; font-size:18px; line-height:150%;">
                                          ${item.body.clean()}
                                          <br>
                                          <a data-linkto="https://"
                                            href="${item.utmify("button", target)}"
                                            style="color:#4e2a84;text-decoration:underline;">
                                            ${item.cta.clean()}
                                            </a>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`,

    divider: () => `
<!-- BLOCK: Divider -->
<table cellpadding="0" cellspacing="0" width="100%"
  role="presentation" class="stylingblock-content-wrapper"
  style="min-width: 100%; ">
  <tbody>
    <tr>
      <td class="stylingblock-content-margin-cell" style="padding: 40px 25px; ">
        <table cellpadding="0" cellspacing="0" width="100%"
          role="presentation"
          style="background-color: transparent; min-width: 100%; "
          class="stylingblock-content-wrapper">
          <tbody>
            <tr>
              <td style="padding: 0px;" class="stylingblock-content-wrapper camarker-inner">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0;">
                  <tbody>
                    <tr>
                      <td style="border-top: 1px solid #808080; width: 100%; background-color: #808080; font-size: 0; line-height: 0; mso-line-height-rule: exactly;">&nbsp;</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`,

    bottom: () => `
<!-- BLOCK: 75px Spacer -->
<table cellpadding="0" cellspacing="0" width="100%" role="presentation" class="stylingblock-content-wrapper" style="min-width: 100%; ">
  <tbody>
    <tr>
      <td class="stylingblock-content-margin-cell" style="padding: 0px 0px 75px 0px; ">
      </td>
    </tr>
  </tbody>
</table>`,
  }, // End twocolumnitems section email template

  web: {
    top: () => ``,
    item: (item) => `
<figure>
	<a href="${item.url}"><img src="${item.imageSrc}" alt="${item.imageAlt}"></a>
</figure>
<article>
	<h4>
		<a href="${item.url}">${item.headline}</a>
	</h4>
	<p>${item.body}
  </br>
	<a href="${item.url}">${item.cta}</a></p>
</article>
		`,
    divider: () => `<hr style="margin: 25px 0; border: .5px solid rgb(128 128 128);">`,
    bottom: () => ``,
  }, // End twocolumnitems section web template
});

/*
 *
 *
 *
 * Initialize newsletters and import data from server.
 *
 *
 *
 */

let source = "SFMC Purple Line Email",
  medium = "email",
  changed = false,
  content = {
    sections: [],
    date: "",
    subject: "",
    subjectInternational: "",
    preheader: "",
    preheaderInternational: "",
    imageLead: "",
    imageLeadAlt: "",
    imageSecondary: "",
    imageSecondaryAlt: "",
  },
  newsletters = [
    new Newsletter({
      target: "domestic",
    }),
    new Newsletter({
      target: "international",
    }),
  ];

content.sections = [newsitems, briefitems, actionitems, twocolumnitems];

loadData();
autosize($("textarea")); // Makes textareas resize depending on contents.

// Add labels before the priority inputs
$(".domestic").before(
  '<div class="priority-label">US order</div><div class="priority-label">International order</div>'
);
