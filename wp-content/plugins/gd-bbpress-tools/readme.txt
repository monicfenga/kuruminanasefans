=== GD bbPress Tools ===
Contributors: GDragoN
Donate link: https://plugins.dev4press.com/gd-bbpress-tools/
Version: 3.0.1
Tags: dev4press, bbpress, signature, quote, bbcodes, toolbar, views, bbcode, forums, forum, topic, reply
Requires at least: 4.9
Requires PHP: 5.6
Tested up to: 5.4
Stable tag: trunk
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Adds different expansions and tools to the bbPress plugin powered forums: BBCode support, signatures, various tweaks, custom views, quote...

== Description ==
Adds various expansions and tools to the bbPress plugin implemented forums. Currently included features:

* Quote Reply or Topic
* Change allowed HTML tags and attributes
* User signature with BBCode and HTML support
* Signature field in BuddyPress profile edit
* Toolbar menu integration
* BBCode shortcodes with 30 BBCodes
* Limit bbPress admin side access
* Tweak: Disable bbPress breadcrumbs
* Tweak: Topic tags field in reply form for author only
* Tweak: Show lead topic
* Tweak: Show search form for all forums and topics
* Tweak: Disable 'private' title prefix
* Topics View: Topics with most replies
* Topics View: Latest Topics
* Topics View: Topics by freshness

= bbPress Plugin Versions =
GD bbPress Tools 3.0 supports bbPress 2.5 or newer. Older bbPress are no longer supported!

= BuddyPress Support =
GD bbPress Tools 3.0 is tested with BuddyPress 5.0 using bbPress. Make sure you enable JavaScript and CSS Settings Always Include option in the plugin settings.

= More free dev4Press.com plugins for bbPress =
* [GD bbPress Attachments](https://wordpress.org/plugins/gd-bbpress-attachments/) - attachments for topics and replies
* [GD Topic Polls](https://wordpress.org/plugins/gd-topic-polls/) - add polls to the bbPress topics
* [GD Power Search](https://wordpress.org/plugins/gd-power-search-for-bbpress/) - add advanced search to the bbPress topics

= Upgrade to GD bbPress Toolbox Pro =
Pro version contains many more great features:

* Enhanced attachments features
* Limit file types attachments upload
* Add custom file types for upload
* BBCodes editor toolbar
* Report topics and replies
* Say thanks to forum members
* Various SEO features
* Various privacy features
* Enable TinyMCE editor
* Private topics and replies
* Auto closing of inactive topics
* Notification email control
* Show user stats in topics and replies
* Track new and unread topics
* Great new responsive admin UI
* Setup Wizard
* Forum based settings overrides
* Improved BuddyPress support
* 40 BBCodes (including Hide and Spoiler)
* 19 more Topics Views
* 9 additional widgets
* Many great tweaks
* And much, much more

With more features on the roadmap exclusively for Pro version.

* More information about [GD bbPress Toolbox Pro](https://plugins.dev4press.com/gd-bbpress-toolbox/?utm_source=wporg&utm_medium=link&utm_campaign=gd-bbpress-tools)
* Compare [Free vs. Pro Plugin](https://plugins.dev4press.com/gd-bbpress-toolbox/articles/toolbox-pro-vs-free-plugins/?utm_source=wporg&utm_medium=link&utm_campaign=gd-bbpress-tools)
* More Premium plugins for bbPress [bbPress Plugins Club](https://bbpress.dev4press.com/?utm_source=wporg&utm_medium=link&utm_campaign=gd-bbpress-tools)

== Installation ==
= General Requirements =
* PHP: 5.6 or newer

= WordPress Requirements =
* WordPress: 4.9 or newer

= bbPress Requirements =
* bbPress Plugin: 2.5 or newer

= Basic Installation =
* Plugin folder in the WordPress plugins folder must be `gd-bbpress-tools`
* Upload folder `gd-bbpress-tools` to the `/wp-content/plugins/` directory
* Activate the plugin through the 'Plugins' menu in WordPress

== Frequently Asked Questions ==
= Where can I configure the plugin? =
Open the Forums menu, and you will see Tools item there. This will open a panel with global plugin settings.

= Will this plugin work with standalone bbPress installation? =
No. This plugin requires the plugin versions of bbPress 2.5 or higher.

= Click on Quote button doesn't add quoted content? =
This happens if the plugin's JavaScript is not loaded. Make sure that both CSS and JavaScript options are enabled. If that doesn't help, make sure to enable 'Always Include' option too.

= Sometimes quoted content when saved appears broken? =
The quote itself doesn't strip HTML, but bbPress does. If the quoted section contains HTML tags or tag attributes that bbPress doesn't allow, it will strip them when the reply is saved. To solve that, you need to use the option to control allowed HTML tags in topics and replies.

= Some features not working with BuddyPress group forums? =
This happens if the plugin's JavaScript is not loaded. Make sure that both CSS and JavaScript options are enabled and 'Always Include' option is also enabled.

= Some BuddyPress features break when I use BuddyPress Nuovo templates? =
The problem is caused by the Italic BBCode due to the conflict with the Underscore templates system BuddyPress uses. You can disable Italic BBCode, or you can limit BBCodes to the bbPress content only (highly recommended).

= When the quote is used on the formatted content, formatting will be gone inside displayed quote? =
This happens because quoting can only take rendered HTML as is, and when saved, bbPress will remove some of the HTML elements based on the user role. [GD bbPress Toolbox Pro](https://plugins.dev4press.com/gd-bbpress-toolbox/) plugin includes additional features that expand the allowed HTML elements for all roles, and that solves this quote problem.

== Upgrade Notice ==
= 3.0 =
Various updates, improvements and fixes.

== Changelog ==
= 3.0.1 - 2020.05.13 =
* Improvements to the plugin readme file
* Fixed small issue with the new private prefix tweak
* Fixed issue with the wrong include path

= 3.0 - 2020.05.09 =
* New Tweak to remove forum and topic Private prefix
* New Tweak to load search form on top of all forums
* New Tweak to load search form on top of all topics
* New reorganized plugin code and the way it is loaded and run
* New rewritten loading of JavaScript and CSS files
* New fully reorganized CSS now written using SCSS
* New loading JavaScript and CSS minified or normal
* Removed WordPress 4.4 shortcodes update
* Removed some outdated and unused code
* Fixed issues when saving some plugin settings

= 2.2 - 2019.09.02 =
* Removed all outdated translations
* Fixed a minor sanitation issues related to shortcodes

= 2.1 - 2019.03.10 =
* New option to change allowed HTML tags and attributes for topics and replies
* Updated readme.txt file and included FAQ list

= 2.0.2 - 2018.08.22 =
* Changed default BBCode option to load on bbPress pages only to enabled
* Updated BBCodes information for potential issue with BuddyPress
* Updated readme.txt file and included FAQ list
* Minor core code changes and improvements

= 2.0.1 - 2018.07.27 =
* Updated readme file with new FAQ entries
* Updated plugin admin code to remove FAQ link

= 2.0 - 2018.07.25 =
* New interface for the plugin settings panel
* New panel with settings for Tweaks
* New tweak: show lead topic
* New tweak: disable breadcrumbs
* New tweak: topic tags in reply for topic author only
* New topics view: Topics Freshness
* Updated toolbar icon to use bbPress dashicon
* Updated WordPress minimal requirement to 4.4
* Updated PHP minimal requirement to 5.5

= 1.9.3 - 2018.02.16 =
* Updated function for universal rendering of BBCodes
* Updated various URL's included in plugin and readme file

= 1.9.2 - 2017.10.26 =
* Added function to access BBCodes handler functions
* Updated trim quote content before adding to editor
* Updated several BBCodes handler functions
* Fixed topic related issue with the quote BBCode
* Fixed minor issue with the loading of Views module

= 1.9.1 - 2017.09.20 =
* Updated WordPress minimal requirement to 4.2
* Updated several broken URL's
* Updated and improved readme file

= 1.9 - 2016.09.24 =
* Updated sanitation of the plugin settings on save
* Updated PHP minimal requirement to 5.3
* Updated WordPress minimal requirement to 4.0
* Updated several broken URL's
* Updated several missing translation strings
* Updated signature editors display filters

= 1.8 - 2015.12.10 =
* Auto update signature for shorthand BBCodes
* Added update tool for WordPress 4.4 shortcodes changes
* Added few missing translation strings
* Updated list of BBCodes to remove shorthand notation
* Updated loading of text domain for centralized translations loading
* Fixed adding quote BBCode using shorthand notation
* Fixed list of BBCodes in some cases missing quotes

= 1.7.1 =
* Updated several Dev4Press links
* Fixed XSS security vulnerability with unsanitized input

= 1.7 =
* Added option to enable DIV tag in the content
* Added check if user can set unfiltered HTML for signatures
* Added option to allow mixing HTML and BBCode in signatures
* Improved signature editing process loading and display
* Fixed display of HTML signatures to non logged users
* Fixed editing signatures on admin profile page breaks HTML
* Fixed warning when saving signature in some cases
* Fixed BuddyPress profile edit shows wrong signature
* Fixed quote problem caused by filtered DIV tags
* Fixed order of the quote content wrapper filters

= 1.6 =
* Added smilies parsing for user signature
* Removed support for bbPress 2.2.x
* Fixed some quote issues with BR tags
* Fixed quote not working with WordPress 3.9

= 1.5.1 =
* Fixed signatures not working with bbPress 2.4
* Fixed quote not working with bbPress 2.4

= 1.5 =
* Added options to disable any of the plugins bbcodes
* Improved bbcodes: youtube code supports full url
* Improved bbcodes: vimeo code supports full url
* Removed support for bbPress 2.1.x
* Fixed option for showing and hiding bbCode notice
* Fixed bbCode youtube and vimeo don't work with SSL active

= 1.4 =
* Select profile group in BuddyPress for signature editor
* Changed loading order for bbPress 2.3 compatibility
* Admin side uses proper enqueue method to load style
* Dropped support for bbPress 2.0
* Dropped support for WordPress 3.2
* Fixed quote not setting proper ID for lead topic display
* Fixed testing for roles allowed for all available tools
* Fixed missing enhanced info when editing signatures
* Fixed missing table cell ending for admin side signature editor

= 1.3.1 =
* Fixed signature visible to logged in users only
* Fixed detection of bbPress 2.2

= 1.3 =
* Added support for dynamic roles from bbPress 2.2
* Added signature edit to BuddyPress profile editor
* Using enqueue scripts and styles to load files on frontend
* Various styling improvements to embedded forms and elements
* Admin menu now uses 'activate_plugins' capability by default
* Screenshots removed from plugin and added into assets directory
* Fixed duplicated signature form on profile edit page
* Fixed signature fails to find topic/reply author
* Fixed signature not displayed when using lead topic
* Fixed quote not working when using lead topic
* Fixed quote in some cases quote link is missing
* Fixed bbcodes not applied when displaying lead topic

= 1.2.9 =
* Fixed another important quote problem with JavaScript

= 1.2.8 =
* Fixed quote not working with HTML editor with fancy editor
* Fixed scroll in JavaScript for quote with IE7 and IE8
* Fixed JavaScript use of trim function with IE7 and IE8
* Fixed problem with quote that breaks the oEmbed

= 1.2.7 =
* BuddyPress with site wide bbPress supported
* Support for signature editing with admin side profile editor
* Expanded list of FAQ entries
* Panel for upgrade to GD bbPress Toolbox
* Added few missing translation strings
* Added German Translation
* Change to generating some links in toolbar menu
* Fixed quote element that can include attachments also
* Fixed quote option displayed when not allowed

= 1.2.6 =
* Fixed toolbar menu when there are no forums to show

= 1.2.5 =
* Added Serbian translation
* Check if bbPress is activated before loading code

= 1.2.4 =
* Fixed toolbar integration bug causing posts edit problems

= 1.2.3 =
* Improvements to shared functions loading
* Improvements to loading of plugin modules

= 1.2.2 =
* Fixed search topics view for bbPress 2.0.2

= 1.2.1 =
* Updated readme.txt with more information
* Fixed broken links in the context help
* Fixed invalid display of user signatures

= 1.2.0 =
* Added user signature with BBCode and HTML support
* Added use of capabilities for all plugin features
* Added support for setting up additional custom views
* Added BBCodes: Vimeo, Image, Font Size, Font Color
* Added basic support for topics search results view
* Allows use of the WordPress rich editor for quoting
* Allows to quote only selected portion of the text
* When you click quote button, page will scroll to the form
* Improvements for the bbPress 2.1 compatibility

= 1.1.0 =
* Added BBCodes shortcodes support
* Added quote reply or topic support
* Added file with shared functions
* Plugin features organized into mods

= 1.0.0 =
* First official release

== Screenshots ==
1. Main settings panel
2. Tweaks panel
3. BBCodes panel
4. Topics Views panel
5. Toolbar bbPress forums menu
6. Setting up signature
