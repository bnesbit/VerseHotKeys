// ==UserScript==
// @name         VerseHotKeys
// @namespace    VerseHotKeys
// @match        https://mail.notes.na.collabserv.com/*
// @version      1.0
// @description  Add's hotkeys to IBM Verse (emulates Gmail hot keys mostly)
// @copyright    2015+, Barry Nesbit
// @author       Barry Nesbit
// @run-at       document-end
// @require http://code.jquery.com/jquery-latest.js
// @require https://craig.global.ssl.fastly.net/js/mousetrap/mousetrap.min.js?7e022
// ==/UserScript==

// 1.0 - initial version cleaned up for sharing

//---------------- Mappings ------------------
/*

* - denotes a hot key that woud be nice to have but is not yet implemented

View Options

? - hot keys help screen*
t then p - toggle the action buttons and people bar
t then c - toggle the calendar footer
t then f - toggle folder view
t then s - toggle search bar
t then a - toggle file attachments selector
t then u - toggle unread emails
t then r - toggle refine results

Navigation

g then i = goto inbox
g then a = goto actions*
g then w = goto waiting for*

Actions

/ - focus on input, open search bar if it's closed
c - compose

Thread Navigation

j - next message
k - previous message
n - next message in thread (only when emails are grouped by thread) *
p - previous message in thread (only when emails are grouped by thread) *

Message Actions

u - mark current message as unread
# - delete
r - reply
a - reply to all, or reply if there is only one recipient
f - forward
e - archive (remove from inbox)

Calendar invite actions

a - accept
d - decline*
t - tentative*
r - respond*
f - forward*

Compose Actions
Note that these actions would require bindings that work in a dialog which requires a bit more work than the simple Moustrap bindings used for these other short cuts

ctrl+enter - send email, implemented by Verse dev already
ctrl+s - save draft, imlemented by Verse dev already
alt+a - attach file*
ctrl+k - URL link*
alt+n - start numbered list*
alt+b - start bullet list*
alt+h - set high priority flag*

*/

//------------ View Options ------------------

// t then p - toggle action button and people bar
//Mousetrap.bind('t p', function() { toggleElement(".setSideBar");}); // hides the entire div. this works, but dev implemented their own toggle button which we can use now
Mousetrap.bind('t p', function() { $(".itm-toggler").click();}); // replicates click on the toggle button

// t then f - toggle calendar footer
//Mousetrap.bind('t c', function() { toggleElement(".calendar-Container");}); // I used to use this before dev implemented their own toggles
Mousetrap.bind('t c', function() { $(".calscrollHour.toggle-btn").click();});

// t then s - toggle search div
Mousetrap.bind('t s', function() { toggleElement(".seq-header");});

// t then a - toggle attachments
Mousetrap.bind('t a', function() { $('.toggle.files').click();});

// t then f - toggle folders
Mousetrap.bind('t f', function() { $(".folders-toggler").click();});

// t then u - toggle unread emails
Mousetrap.bind('t u', function() { $('.toggle.unread.icon').click();});

// t then r - toggle refine results
Mousetrap.bind('t r', function() { $('.facets-toggler.icon').click();});


//------------ Navigation --------------------

// g then i - goto to inbox
Mousetrap.bind('g i', function() {
    $('.seq-search-bar .oti-model .shadow-input').val('');
    $('button.searchButton').click();
});

//------------ Actions -----------------------

// / - focus on search (and open search bar if it's hidden)
Mousetrap.bind('/', function() {
    if ( $('.seq-header').is(':hidden') ) { toggleElement('.seq-header');}
    $('.seq-search-bar .oti-model .shadow-input').focus();
    return false;
});

// c - compose new email
Mousetrap.bind('c', function() {  $(".compose-button").click();});


//------------ Thread Navigation--------------

// j - next message in list, or first message if none selected
// late night coding alert... perhaps more elegant way to do this is get index of last selected, add 1, get element; or, send down cursor
Mousetrap.bind('j', function() {
    var nextMessage, bFoundSelected;
    var messageList = $('OL li');
    if ( messageList.filter('.selected').length > 0 ) {
        messageList.each( function() {
            var message = $(this);
            if (message.hasClass('selected')) {
                bFoundSelected = true;
            } else {
                if (bFoundSelected) {
                    nextMessage = message;
                    bFoundSelected = false;
                }
            }
        });
        nextMessage.click();
    } else {
        messageList.first().click();
    }
});

// k - previous message in list, or last if none selected
Mousetrap.bind('k', function() {
    var nextMessage;
    var messageList = $('OL li');
    if ( messageList.filter('.selected').length > 0 ) {
        messageList.each( function() {
            var message = $(this);
            if (message.hasClass('selected')) {
                return false;
            }
            nextMessage = message;
        });
        nextMessage.click();
    } else {
        messageList.last().click();
    }
});

//------------ Message Actions ---------------

// u - mark current email as unread
Mousetrap.bind('u', function(){
    // Needs to be fixed. This hotkey used to work the same as clicking the "mark unread" button, but no longer. This only works if the message is closed in the preview window.
    $(".action.pp-close.icon").click();
    $(".action.icon.pim-mark-unread").click();
});

// # - delete current email
Mousetrap.bind('#', function(){ $(".action.pim-delete").click();});

// r - reply
Mousetrap.bind('r', function(){ $(".action.reply").click();});

// a - reply-to-all for messages (or reply with only one sender), or accept meeting if a calendar invite
Mousetrap.bind('a', function() {
    if ( $('.action.reply-all').is(':visible') ) {
        $('.action.reply-all').click();
        return;
    } else if ( $('.action.reply').is(':visible') ) {
        $('.action.reply').click();
        return;
    } else if ( $('.action.accept').is(':visible') ) {
        $('.action.accept').click();
        return;
    } else if ( $('.action.Apply.Update').is(':visible') ) {
        $('.action.Apply.Update').click();
        return;
    }
});

// f - forward
Mousetrap.bind('f', function(){ $(".action.forward").click();});

// f - forward
Mousetrap.bind('e', function(){ $('.sticky-header span[title="Folder: Inbox"] span[data-dojo-attach-point="closeButton"]').click();});


//------------ Calendar Invite Actions -------


//------------ Compose Actions ---------------


//------------ Functions ---------------------

// used to toggle and resize key elements when another is hidden or made visible
function toggleElement(elementClassName) {
    var height = $(elementClassName).css("height");
    if ( $(elementClassName).is(":visible") ) {
        // expand mcv height by elmenent height
        $(".seq-mcv").css("height", "+="+height);
    } else {
        // shrink mcv height by calendar height
        $(".seq-mcv").css("height", "-="+height);
    }
    $(elementClassName).toggle();
}
