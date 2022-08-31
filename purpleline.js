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

let imagePlaceholder =
  "https://www.alumni.northwestern.edu/s/1479/images/gid2/editor/alumni_newsletter/purple_line/placeholder-600-325.jpg";
let imagePath = "http://assets.ard.northwestern.edu/images/purple-line/";
let d = new Date();
let currentYear = d.getFullYear();
let currentMonth = d.toLocaleString("en-us", { month: "long" });

class Newsletter {
  constructor(config) {
    this.target = config.target;
    this.top = `<style>
/*------------------------------------*\
   EMAIL CLIENT SPECIFIC STYLES
\*------------------------------------*/
  .ReadMsgBody, .ExternalClass { width:100%; } /* Force Hotmail/Outlook.com to display emails at full width */  
  .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height:100%; } /* Force Hotmail/Outlook.com to display normal line spacing */
  body, table, td, p, a, li, blockquote { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; } /* Prevent WebKit and Windows mobile from changing default text sizes */
  table, td { mso-table-lspace:0pt; mso-table-rspace:0pt; } /* Removes spacing between tables in Outlook 2007 and up */
  img { -ms-interpolation-mode:bicubic; } /* Allows smoother rendering of resized images in Internet Explorer */
  .footer a { color:/*#ffffff*/; text-decoration:none; } /* Add this class to the system footer to change the unsubscribe link ---does not work for Gmail--- */
  .iOSfix a { color:/*#ffffff*/; text-decoration:none; } /* Override the default blue link style that iOS puts on address and phone numbers */
  .iOSfixaside a { color:/*#000000*/; text-decoration:none; } /* Alternate Style - Override the default blue link style that iOS puts on address and phone numbers */
  .em-dragdrop-dummy { display:none!important; }  

/*------------------------------------*\
   RESET STYLES
\*------------------------------------*/
  body { min-width:100% !important; }
  html { width:100%; }
  img { border:0; height:auto; line-height:100%; outline:none; text-decoration:none; }
  table { border-collapse:collapse !important; }
  body, .emWrapperTable, .emWrapperCell { height:100% !important; margin:0; padding:0; }  
  .mobileHeaderWidth .em-dockitem-empty, .mobileFooterWidth .em-dockitem-empty, .emWrapperTable, .emWrapperCell { width:100% !important; }
  div { padding:0px !important; }
  h1, h2, h3, h4, h5, h6 { display:block; margin:0px; }
  p { margin:0em 0em 1em; margin-bottom:1em; }  

/*------------------------------------*\
   MOBILE STYLES
\*------------------------------------*/  
  @media only screen and (max-device-width: 720px)  {
  td[class="mobileHeaderCell"],
  td[class="mobileColumnCell"],
  td[class="mobileFooterCell"],
    td[class="mWidth"] { display:block !important; }
  table[class="mobileHeaderWidth"],
  table[class="mobileColumnWidth"],
  table[class="mobileFooterWidth"],
  td[class="mobileHeaderCell"],
  td[class="mobileColumnCell"],
  td[class="mobileFooterCell"] { width:480px!important; }
  *[class="mWidth"] { width:100%!important; }
  
  /* general display styles */
  td { -webkit-box-sizing:border-box; box-sizing:border-box; }
  *[class="mHide"] { display:none!important; }
  *[class="mBreak"] { display:block!important; }
  *[class="mTextCenter"] { text-align:center!important; }
  *[class="mCenter"] { margin:0px auto!important; }
  
  /* link styles */
  
  /* image styles */
  img[class="mFullImage"] { width:100%!important; height:auto!important; }
  }     
  @media only screen and (max-device-width: 479px) {
  table[class="mobileHeaderWidth"],
  table[class="mobileColumnWidth"],
  table[class="mobileFooterWidth"],
  td[class="mobileHeaderCell"],
  td[class="mobileColumnCell"],
  td[class="mobileFooterCell"] { width:320px!important; }
  
  /* general display styles */
  
  /* link styles */
  
  /* image styles */
  }

/* Specific to Purple Line */

body {padding:0;}
#main-ct {
  width: 600px;
}
#main-ct img {  
  max-width:100%;
  width:100%;
}
#main-ct #logo-nu { 
  width: 44%;
}
#main-ct .links-footer {
  width: 70%;
}
#main-ct a, #main-ct a:link, #main-ct a:visited { 
  color:#4e2a84; 
}
#main-ct a.btn, #main-ct a.btn:link, #main-ct a.btn:visited {
  color:#fff; 
} 
td[class="btn"] {
  text-decoration:none;
  width: 260px;
  color: #ffffff;
  display:inline-block;
  font-family: Arial, sans-serif;
  font-size: 16px;
  font-weight: 600;
  text-transform:uppercase;
}
#main-ct #corona-msg a {
  color: white !important;
}
/* mobile */
@media screen and (max-width : 768px) {
  #main-ct {
    width: 100%;
    text-align: center;
    color: #716c6b;
  }
  #main-ct #logo-nu {
    width: 66%;
  }
  #main-ct .links-footer {
    width: 90%;
  }
}

/* dark mode */
@media (prefers-color-scheme: dark) {
  body {
    background-color: #262524 !important;
  }
  #main-ct {
    color: white !important;
    background-color: #262524 !important;
  }
  #main-ct td {
    color: white !important;
  }
  .light-logo {
    display: none !important;
  }
  .dark-logo {
    display: block !important;
  }
  .section-title {
    color: white !important;
  }
  #main-ct a, #main-ct a:link, #main-ct a:visited { 
    color: #b6acd1 !important; 
  }
  #main-ct a.btn, #main-ct a.btn:link, #main-ct a.btn:visited {
    color:#fff !important; 
  }
  #main-ct #corona-msg a {
    color: white !important;
  }
  #main-ct #info-bar {
    background-color: #3c3b39 !important;
    border-bottom: 4px solid #262524 !important;
  }
  #main-ct #info-bar a{
    color: white !important;
  }
}

#divHostedEmailLink {
font-size: 12px;
font-family: Arial, sans-serif;
text-align: center;
}
#divHostedEmailLink a {
color: #ccc;
}

a.btn,
a.btn:hover,
a.btn:visited,
a.btn:active {
color: white !important;
}
</style>


<table border="0" cellspacing="0" cellpadding="0" width="600" id="main-ct" align="center">
  <tbody>
  	<tr style="display:none !important;
        visibility:hidden;
        mso-hide:all;
        font-size:1px;
        color:#ffffff;
        line-height:1px;
        max-height:0px;
        max-width:0px;
        opacity:0;
        overflow:hidden;">
        <td id="prehead" style="display:none !important;
				visibility:hidden;
				mso-hide:all;
				font-size:1px;
				color:#ffffff;
				line-height:1px;
				max-height:0px;
				max-width:0px;
				opacity:0;
				overflow:hidden;">
			##PREHEADER##
		</td>
    </tr>
    <tr>
      <td style="padding-top: 10px; padding-bottom: 5px; text-align: center; font-size: 12px; color: #BBB8B8 !important; font-family: "><!-- view in browser -->
        <p style="padding: 0; margin: 0;text-align: center;">
          ##Webview##
        </p>
      </td>
    </tr>
    <tr>
      <td><!-- header -->
        <table border="0" cellspacing="0" cellpadding="0" width="100%" align="center">
          <tbody>
            <tr>
              <td style="padding-top:20px;" class="light-logo">
                <img class="light-logo" src="https://admin.alumni.northwestern.edu/s/1479/images/gid2/editor/alumni_newsletter/purple_line/purple_line_logo-final.jpg" alt="Purple Line" width="600" height="84">
              </td>
              <td style="padding-top:20px; display: none;" class="dark-logo">
                <img style="display: none;" class="dark-logo" src="https://admin.alumni.northwestern.edu/s/1479/images/gid2/editor_documents/alumni_newsletter/purple_line/purple_line_logo_dark-final.jpg" alt="Purple Line" width="600" height="84">
              </td>
            </tr>
            <tr>
              <td style="padding-bottom:20px;">
                <table border="0" cellspacing="0" cellpadding="0" width="80%" align="center" style="text-align:center; margin:0 auto;">
                  <tbody>
                    <tr>
                      <td style="font-size:16px; font-family: Arial, sans-serif; color: #716c6b; text-align:center; letter-spacing:0.8px;">                                                           The latest news for Northwestern alumni
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
                <td style="padding: 16px; background: #4e2a84;">
                  <table border="0" cellspacing="0" cellpadding="0" width="80%" align="center" style="text-align:center; margin:0 auto;">
                    <tbody>
                      <tr>
                        <td id="corona-msg" style="font-size:16px; font-family: Arial, sans-serif; color: white; text-align:center; letter-spacing:0.8px;">                                                          <a href="https://www.northwestern.edu/coronavirus-covid-19-updates" style="color: white !important;">Follow Northwestern’s COVID-19 and campus updates</a>
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


<table border="0" cellspacing="0" cellpadding="0" width="600" id="main-ct" align="center" style="table-layout: fixed;"><tbody>`;
    this.bottom = `</tbody></table>

				<table border="0" cellspacing="0" cellpadding="0" width="600" id="main-ct" align="center" style="table-layout: fixed;">
			    <tbody>
		        <tr>
	            <td style="padding-top:40px;">
		            <!-- your information -->
		            <table border="0" cellspacing="0" cellpadding="0" width="100%" align="center" style="text-align:center;">
	                <tbody>
                    <tr>
                      <td style="border-top:2px solid #4e2a84; font-size:22px; font-family: Arial, sans-serif; font-weight:500; padding-top:40px; padding-bottom:20px; color: #4e2a84; ">
                        Is the information below incorrect or blank?
                      </td>
                    </tr>
                    <!-- info table -->
                    <tr>
                      <td>
                        <table border="0" cellspacing="0" cellpadding="0" width="90%" align="center" style="text-align:center; margin: 0 auto;">
                        <tbody>
	                        <!-- name -->
	                        <tr>
                            <td id="info-bar" style="font-size:16px; font-family: Arial, sans-serif; color:#4e2a84; background-color: #f0f0f0; padding-top:10px; padding-bottom:10px; padding-left: 5px; padding-right: 5px; border-bottom:4px solid #ffffff;">
                              ##First Name## ##Last Name##
                            </td>
                          </tr>
	                        <!-- address -->
                          <tr>
                            <td id="info-bar" style="font-size:16px; font-family: Arial, sans-serif; color:#4e2a84; background-color: #f0f0f0; padding-top:10px; padding-bottom:10px; padding-left: 5px; padding-right: 5px; border-bottom:4px solid #ffffff;">
                              ##Preferred City##, ##Preferred State## ##Preferred Zip##
                            </td>
                          </tr>
	                        <!-- email -->
                          <tr>
	                          <td id="info-bar" style="font-size:16px; font-family: Arial, sans-serif; color:#4e2a84; background-color: #f0f0f0; padding-top:10px; padding-bottom:10px; padding-left: 5px; padding-right: 5px; text-decoration:none;">
                              ##Preferred Email##
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
	                <!-- cta -->
                  <tr>
                    <td style="padding-top:20px;">
                      <table border="0" cellspacing="0" cellpadding="0" width="90%" align="center" style="text-align:center; margin: 0 auto;">
                      <!-- event title -->
                      <tbody>
                        <tr>
                          <td style="padding-top:20px; padding-bottom:20px;" align="center">
                            <table border="0" cellspacing="0" cellpadding="0" width="260" align="center" style="text-align:center;">
                              <tbody>
                                <tr>
                                  <td style="padding-top:12px; padding-bottom:12px; padding-left:12px; padding-right:12px; background-color:#4e2a84; color: #ffffff; font-family: Arial, sans-serif; font-size: 16px; font-weight: 600; text-transform:uppercase;"><a href="https://www.alumni.northwestern.edu/s/1479/02-naa/16/interior_no-utility.aspx?sid=1479&gid=2&pgid=21640&cid=34996&utm_source=iModules%20email&utm_medium=email&utm_campaign=Purple%20Line&source=${
                                    currentMonth + currentYear
                                  }PurpleLineEmail" style="background-color:#4e2a84; text-decoration:none; color: #ffffff; display:inline-block; font-family: Arial, sans-serif; font-size: 16px; font-weight: 600; text-transform:uppercase;" class="btn" target="_blank">
                                    Update My Profile</a>
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
          <td style="padding-top:20px;">
            <!-- other links-->
            <table border="0" cellspacing="0" cellpadding="0" width="100%" align="center" style="text-align:center;">
              <tbody>
              	<tr>
                  <td style="border-top:2px solid #f0f0f0; font-size:16px; font-family: Arial, sans-serif; font-weight:700; padding-top:14px; padding-bottom:14px;">
                    <a href="https://www.alumni.northwestern.edu/s/1479/02-naa/16/landing-tabbed.aspx?sid=1479&gid=2&pgid=34478&utm_medium=email&utm_source=iModules%20email&utm_campaign=${currentMonth}%20${currentYear}%20Purple%20Line" style="color: #4e2a84; text-decoration: none; text-transform: uppercase;" target="_blank">Find a Virtual Event</a>
                  </td>
                </tr>
                <tr>
                  <td style="border-top:2px solid #f0f0f0; font-size:16px; font-family: Arial, sans-serif; font-weight:700; padding-top:14px; padding-bottom:14px;">
                    <a href="http://www.alumni.northwestern.edu/s/1479/02-naa/16/landing.aspx?sid=1479&gid=2&pgid=20763&utm_medium=email&utm_source=iModules%20email&utm_campaign=${currentMonth}%20${currentYear}%20Purple%20Line" style="color: #4e2a84; text-decoration: none; text-transform: uppercase;" target="_blank">Browse Career Resources</a>
                  </td>
                </tr>
	              <tr>
	                <td style="border-top:2px solid #f0f0f0; font-size:16px; font-family: Arial, sans-serif; font-weight:700; padding-top:14px; padding-bottom:14px; ">
                    <a href="http://www.alumni.northwestern.edu/s/1479/02-naa/16/interior.aspx?sid=1479&gid=2&pgid=21065&utm_medium=email&utm_source=iModules%20email&utm_campaign=${currentMonth}%20${currentYear}%20Purple%20Line" style="color: #4e2a84; text-decoration: none; text-transform: uppercase;" target="_blank">Find an Alumni Club</a>
                  </td>
                </tr>
                <tr>
                  <td style="border-top:2px solid #f0f0f0; border-bottom:2px solid #f0f0f0; font-size:16px; font-family: Arial, sans-serif; font-weight:700; padding-top:14px; padding-bottom:14px; ">
                    <a href="https://www.alumni.northwestern.edu/s/1479/02-naa/16/interior_ournw.aspx?sid=1479&gid=2&pgid=6#/Search/Simple" style="color: #4e2a84; text-decoration: none; text-transform: uppercase;" target="_blank">Search the Alumni Directory</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
	      <tr>
	      <td style="padding-top:20px;">
		      <!-- footer-->
		      <table border="0" cellspacing="0" cellpadding="0" width="100%" align="center" style="text-align:center; table-layout: fixed;">
			      <tbody>
              <tr>
                <td>
                <!-- social -->
                  <table border="0" cellspacing="0" cellpadding="0" width="60%" align="center" style="text-align:center; margin: 0 auto;">
                    <tbody>
                      <tr>
                        <td style="padding-left:10px: padding-right:10px;">
                          <a href="https://twitter.com/NUAlumni" target="_blank"><img src="https://www.alumni.northwestern.edu/s/1479/images/gid2/editor_documents/alumni_newsletter/purple_line/twitter.png" alt="Twitter" style="max-width: 42px;" width="42" height="42"></a>
                        </td>
                        <td style="padding-left:10px: padding-right:10px;">
                          <a href="https://www.facebook.com/northwesternalumni" target="_blank"><img src="https://www.alumni.northwestern.edu/s/1479/images/gid2/editor_documents/alumni_newsletter/purple_line/facebook.png" alt="Facebook" style="max-width: 42px;" width="42" height="42"></a>
                        </td>
                        <td style="padding-left:10px: padding-right:10px;">
	                        <a href="https://www.instagram.com/northwesternalumni" target="_blank"><img src="https://www.alumni.northwestern.edu/s/1479/images/gid2/editor_documents/alumni_newsletter/purple_line/instagram.png" alt="Instagram" style="max-width: 42px;" width="42" height="42"></a>
                        </td>
                        <td style="padding-left:10px: padding-right:10px;">
                          <a href="https://www.linkedin.com/groups/885" target="_blank"><img src="https://www.alumni.northwestern.edu/s/1479/images/gid2/editor_documents/alumni_newsletter/purple_line/linkedin.png" alt="Linkedin" style="max-width: 42px;" width="42" height="42"></a>
                        </td>
                      </tr>
                    </tbody>
	                </table>
                </td>
              </tr>
	            <!-- Northwestern University logo -->
              <tr>
                <td style="padding-top:40px;">
                  <table border="0" cellspacing="0" cellpadding="0" align="center" width="100%" style="text-align:center; margin: 0 auto;" id="logo-nu">
                    <tbody>
                      <tr>
                        <td style="" class="dark-logo">
                          <a href="http://www.northwestern.edu/" target="_blank"><img class="light-logo" src="https://www.alumni.northwestern.edu/s/1479/images/gid2/editor/alumni_newsletter/purple_line/northwestern_university_logo.jpg" width="300" height="27"></a>
                        </td>
                      </tr>
                      <tr>
                        <td style="display: none;" class="dark-logo">
                          <a href="http://www.northwestern.edu/" target="_blank"><img class="dark-logo" src="https://www.alumni.northwestern.edu/s/1479/images/gid2/editor_documents/alumni_newsletter/purple_line/northwestern-university.png" style="display: none !important;" width="300" height="27"></a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <!-- other links -->
              <tr>
                <td style="padding-top:20px;">
                  <table border="0" cellspacing="0" cellpadding="0" align="center" width="70%" style="text-align:center; margin: 0 auto;">


                  <p>
                          <a href="http://www.alumni.northwestern.edu/?utm_medium=email&utm_source=iModules%20email&utm_campaign=${currentMonth}%20${currentYear}Purple%20Line" style="font-size:14px; font-family: Arial, sans-serif; color: #4e2a84; text-decoration:none;" target="_blank">alumni.northwestern.edu</a>
                        </p><p>
                          <a href="http://giving.northwestern.edu/?utm_medium=email&utm_source=iModules%20email&utm_campaign=${currentMonth}%20${currentYear}Purple%20Line" style="font-size:14px; font-family: Arial, sans-serif; color: #4e2a84; text-decoration:none;" target="_blank">giving.northwestern.edu</a>
                      </p>
                      <p style="font-size: 12px; font-family: Arial, sans-serif;color:#716c6b;">##Unsubscribe## </p><p style="font-size: 12px; font-family: Arial, sans-serif;color:#716c6b;"> ##Sender_Org##<br>##Sender_Address##<br>##Sender_City##, ##Sender_State## 60208</p>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
	</table>
		`;
  }

  get render() {
    let output = "";

    output += this.top;
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
      sorteditems.forEach((item) => {
        output += this.templates.email.item(item, target);
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
      sorteditems.forEach((item) => {
        output += this.templates.web.item(item);
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
  output = this.replace(/(?:\r\n|\r|\n)/g, "<br />");

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
  content.imageSecondary = $("#pl-image-secondary").val();

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
      response = JSON.parse(r);
      if (response.success == false) {
        alert("Save failed. " + response.message);
      }
    })
      .done(function () {
        markSaved();
      })
      .fail(function () {
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
    $("#pl-image-secondary").val(response.imageSecondary);

    response.sections.forEach((section) => {
      // For each item in each nth section, update the corresponding input in the nth .item of that type.
      for (var i = 0; i < section.items.length; i++) {
        item = section.items[i];
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

/*
 *
 *
 *
 * Define sections and creat their templates (as functions)
 *
 *
 *
 */

let newsitems = new Section("newsitems", {
  email: {
    top: (item, target) => `
<tr>
	<td><!-- top stories -->
		<table border="0" cellspacing="0" cellpadding="0" width="100%" align="center" style="text-align:center;">
			<tbody>
				<tr>
					<td style="border-top:2px solid #4e2a84; font-size:16px; font-family: Georgia, Times, \'Times New Roman\', serif; 
										 padding:20px 0; color: #716c6b; font-style:italic;" class="section-title">
						Top Stories
					</td>
				</tr>
				<tr>
						<td>
		          <a href="${item.utmify("photo", target)}" 
				         target="_blank"
				         style="color: #4e2a84;"><img
																         src="${
                                           content.imageLead
                                             ? imagePath + content.imageLead
                                             : imagePlaceholder
                                         }" 
																         alt=""
																         title=""
																         style=""
																         width="600"></a>
		        </td>
        </tr>`,

    item: (item, target) => `
<!-- story -->
<tr>
	<td>
    <table border="0" cellspacing="0" cellpadding="0" width="90%" align="center" style="text-align:center; margin: 0 auto;">
	    <tbody>
  	    <!-- story title -->
        <tr>
          <td style="padding:30px 0 20px 0;"><a href="${item.utmify(
            "headline",
            target
          )}" style="font-size:28px; font-family: Georgia, Times, 'Times New Roman', serif;color: #4e2a84; font-weight:700; text-decoration:none;">${item.headline.clean()}</a></td>
        </tr>
		    <!-- story description-->
        <tr>
          <td style="font-size:16px; font-family: Arial, sans-serif; color: #716c6b; line-height:1.6;">
	          ${item.body.clean()}</td>
          </tr>
        <!-- cta -->
        <tr>
          <td style="padding:20px 0;" align="center">
            <table border="0" cellspacing="0" cellpadding="0" width="260" align="center" style="text-align:center;">
              <tbody>
                <tr>
	                <td style="padding:12px; background-color:#4e2a84; color: #ffffff; font-family: Arial, sans-serif; font-size: 16px; 
						                font-weight: 600; text-transform:uppercase;">
		                <a class="btn" href="${item.utmify("button", target)}" 
				               style="background-color:#4e2a84; text-decoration:none; color: #ffffff; display:inline-block; font-family: Arial, sans-serif; 
							                font-size: 16px; font-weight: 600; text-transform:uppercase;">
			                ${item.cta.clean()}
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
</tr>`,

    bottom: () => "</tbody></table></td></tr>",
  }, // End section email template

  web: {
    top: () => `

<link rel="stylesheet" href="//assets.ard.northwestern.edu/css/purpleline.css">
<p class="note">The <em>Purple Line</em> newsletter brings you top stories from Northwestern, ways to stay connected, upcoming events, and more. Ensure that you receive the monthly email by <a href="http://www.alumni.northwestern.edu/s/1479/02-naa/16/interior_no-utility.aspx?sid=1479&gid=2&pgid=25080&cid=42031&source=${
      currentMonth + currentYear
    }PurpleLineArchive">updating your information</a> with us.
</p>
<div class="purple-line-archive">
<figure class="logo">
<img src="http://alumni.northwestern.edu/s/1479/images/gid2/editor/purple-line/purpleline-logo.png" height="124" width="600" alt="Purple Line">
</figure>
<h3>The latest news for Northwestern alumni</h3>
<p class="pl-date">${currentMonth} ${currentYear}</p>
<h4>Top Stories</h4>
<figure>
	<img src="${imagePath}${content.imageLead}"
	width="600" alt="">
</figure>
		`,
    item: (item) => `
<article>
	<h1 class="balance-text">
		<a href="${item.url}">${item.headline}</a>
	</h1>
	<p class="balance-text">${item.body}</p>
	<p><a href="${item.url}" class="button">${item.cta}</a></p>
</article>
		`,
    bottom: () => ``,
  }, // End section web template
});

let interactiveitems = new Section("interactiveitems", {
  email: {
    top: (item, target) => `
<tr>
  <td style="padding-top:20px;">
	  <!-- feedback banner -->
	  <table border="0" cellspacing="0" cellpadding="0" width="100%" align="center" style="text-align:center; ">
		  <tbody>
		    <tr>
          <td style="background-color:#4e2a84; padding-top:60px; padding-bottom:60px;">
            <table border="0" cellspacing="0" cellpadding="0" width="90%" align="center" style="text-align:center; margin: 0 auto;">
              <tbody>
	              <tr>
				          <td style="font-family: Arial, sans-serif; color:#ffffff; font-size:24px;">
					          ${item.headline.clean()}
				          </td>
			          </tr>
			          <tr>
				          <td style="padding-top:20px;">
					          <table border="0" cellspacing="0" cellpadding="0" width="260" align="center" style="text-align:center; margin: 0 auto;">
						          <tbody>
							          <tr>
								          <td style="padding:12px; background-color:#7fcecd; color: #ffffff; font-family: Arial, sans-serif; 
													           font-size: 16px; font-weight: 600; text-transform:uppercase;">
									          <a href="${item.utmify("button", target)}" class="btn" 
										           style="background-color:#7fcecd; text-decoration:none; color: #ffffff; display:inline-block; 
													            font-family: Arial, sans-serif; font-size: 16px; font-weight: 600; text-transform:uppercase;" 
										           target="_blank">
									            ${item.cta.clean()}
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
</tr>`,

    item: () => "", // We just want 1 item, so build it into top().

    bottom: () => "",
  }, // End section email template

  web: {
    top: (item) => `
<div class="pl-interactive">
<p class="balance-text">
	${item.headline}
</p>
<p>
	<a href="${item.url}" class="button">${item.cta}</a></p>
</div>`,
    item: (item) => ``,
    bottom: () => ``,
  }, // End section web template
});

let connecteditems = new Section("connecteditems", {
  email: {
    top: (item, target) => `
<tr>
  <td style="padding-top:40px;">
	  <!-- stay connected -->
    <table border="0" cellspacing="0" cellpadding="0" width="100%" align="center" style="text-align:center;">
      <tbody>
        <tr>
          <td style="border-top:2px solid #4e2a84; font-size:16px; font-family: Georgia, Times, \'Times New Roman\', serif;
					           padding:20px 0; color: #716c6b; font-style:italic;" class="section-title">
            Stay Connected
          </td>
        </tr>
        <tr>
	        <td>
	          <a href="${item.utmify("photo", target)}" 
			         target="_blank" 
			         style="color: #4e2a84;"><img 
																        src="${
                                          content.imageSecondary
                                            ? imagePath + content.imageSecondary
                                            : imagePlaceholder
                                        }" 
																        alt="" 
																        title="" 
																        style="" 
																        width="600" ></a>
	        </td>
	      </tr>`,

    item: (item, target) => `
<!-- story -->
<tr>
	<td>
    <table border="0" cellspacing="0" cellpadding="0" width="90%" align="center" style="text-align:center; margin: 0 auto;">
      <tbody>
	      <!-- story title -->
        <tr>
          <td style="padding:30px 0 20px 0;">
            <a href="${item.utmify("headline", target)}" 
               style="font-size:28px; font-family: Georgia, Times, 'Times New Roman', serif;color: #4e2a84; font-weight:700; text-decoration:none;" 
               target="_blank">
              ${item.headline.clean()}
            </a>
          </td>
        </tr>
        <!-- story description-->
        <tr>
          <td style="font-size:16px; font-family: Arial, sans-serif; color: #716c6b; line-height:1.6;">${item.body.clean()}</td>
        </tr>
        <!-- cta -->
        <tr>
          <td style="padding:20px 0;" align="center">
            <table border="0" cellspacing="0" cellpadding="0" width="260" align="center" style="text-align:center;">
              <tbody>
                <tr>
                  <td style="padding:12px; background-color:#5091cd; color: #ffffff; font-family: Arial, 
					                   sans-serif; font-size: 16px; font-weight: 600; text-transform:uppercase;">
	                  <a href="${item.utmify(
                      "button",
                      target
                    )}" class="btn" style="background-color:#5091cd; text-decoration:none; 
					                  color: #ffffff; display:inline-block; font-family: Arial, sans-serif; font-size: 16px; font-weight: 600; text-transform:uppercase;" 
		                   target="_blank">
                        ${item.cta.clean()}
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
</tr>`,

    bottom: () => `</tbody></table></td></tr>`,
  }, // End section email template

  web: {
    top: () => `
<h4>Stay Connected</h4>
<figure>
	<img src="${imagePath + content.imageSecondary}" 
			 alt="" style=""><br>
</figure>`,
    item: (item) => `

<article class="pl-connected">
	<h1>
		<a href="${item.url}">${item.headline}</a>
	</h1>
	<p>${item.body}</p>
	<p><a href="${item.url}" class="button">${item.cta}</a></p>
</article>

		`,
    bottom: () => ``,
  }, // End section web template
});

let calendaritems = new Section("calendaritems", {
  email: {
    top: () => `
	<tr>
    <td style="padding-top:40px;">
    <!-- upcoming events -->
    <table border="0" cellspacing="0" cellpadding="0" width="100%" align="center" style="text-align:center;">
      <tbody>
		    <tr>
          <td style="border-top:2px solid #4e2a84; font-size:16px; font-family: Georgia, Times, \'Times New Roman\', serif; padding:20px 0; color: #716c6b; font-style:italic;">
            Upcoming Events
          </td>
        </tr>`,

    item: (item, target) => `
<!-- event -->
<tr>
  <td>
    <table border="0" cellspacing="0" cellpadding="0" width="90%" align="center" style="text-align:center; margin: 0 auto;">
	    <tbody>
		    <!-- event title -->
		    <tr>
			    <td style="padding-top:20px; padding-bottom:5px;">
		        <a href="${item.utmify("headline", target)}" 
				       style="font-size:22px; font-family: Arial, sans-serif;  text-decoration:none;" 
				       target="_blank">
				       ${item.headline.clean()}
			      </a>
		      </td>
		    </tr>
		    <!-- event date-->
		    <tr>
		      <td style="font-size:16px; font-family: Arial, sans-serif; color: #716c6b; line-height:normal;">
		        ${target == "domestic" ? item.date : item.dateInternational}
		      </td>
		    </tr>
		  </tbody>
	  </table>
  </td>
</tr>`,

    bottom: () => `
					<!-- events cta -->
				  <tr><td style="padding-top:10px;">
				  <table border="0" cellspacing="0" cellpadding="0" width="90%" align="center" style="text-align:center; margin: 0 auto;">
				    <tbody>
				      <tr>
				        <td style="padding:20px 0;" align="center">
					        <table border="0" cellspacing="0" cellpadding="0" width="260" align="center" style="text-align:center; margin: 0 auto;">
					          <tbody>
				              <tr>
				                <td style="padding:12px; background-color:#58a047; color: #ffffff; font-family: Arial, sans-serif; font-size: 16px; font-weight: 600; text-transform:uppercase;">
				                  <a href="http://www.alumni.northwestern.edu/s/1479/02-naa/16/home.aspx?sid=1479&gid=2&pgid=21050&utm_medium=email&utm_source=iModules%20email&utm_campaign=Purple%20Line" style="background-color:#58a047; text-decoration:none; color: #ffffff; font-family: Arial, sans-serif; font-size: 16px; font-weight: 600; text-transform:uppercase;">Find More Events</a>
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
</tr>`,
  }, // End section email template

  web: {
    top: () => `
			<h4>Upcoming Events</h4>
			<div class="pl-upcoming">
			<ul class="pl-upcoming-list">
		`,
    item: (item) => `
<li>
	<a href="${item.url}">${item.headline}</a><br>
  ${item.date}
</li>

		`,
    bottom: () => `
</ul>
<p><a href="http://www.alumni.northwestern.edu/s/1479/02-naa/16/home.aspx?sid=1479&gid=2&pgid=21050" class="button">Find more events</a></p>
</div>
</div>

		`,
  }, // End section web template
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

let source = "iModules email",
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
    imageSecondary: "",
  },
  newsletters = [
    new Newsletter({
      target: "domestic",
    }),
    new Newsletter({
      target: "international",
    }),
  ];

content.sections = [newsitems, interactiveitems, connecteditems, calendaritems];

loadData();
autosize($("textarea")); // Makes textareas resize depending on contents.

// Add labels before the priority inputs
$(".domestic").before(
  '<div class="priority-label">Domestic order</div><div class="priority-label">International order</div>'
);
