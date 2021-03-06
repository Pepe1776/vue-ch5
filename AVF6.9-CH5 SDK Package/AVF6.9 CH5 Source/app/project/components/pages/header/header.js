/**
 * Copyright (C) 2020 to the present, Crestron Electronics, Inc.
 * All rights reserved.
 * No part of this software may be reproduced in any form, machine
 * or natural, without the express written consent of Crestron Electronics.
 * Use of this source code is subject to the terms of the Crestron Software License Agreement 
 * under which you licensed this source code.  
 *
 * This code was automatically generated by Crestron's code generation tool.
 */
/* jslint es6 */

const headerModule = (function () {
    'use strict';

    /**
     * Initialize variables
     */
    function onInit() {
        invokeUnsubscriptions();
        initializeVariables();
        invokeSubscriptions();
    }

    /**
     * Invoke subscriptions related to module
     */
    function invokeSubscriptions() {

    }

    /**
     * Invoke unsubscriptions related to module
     */
    function invokeUnsubscriptions() {

    }

    /**
     * Initialize all the variables used in this module
     */
    function initializeVariables() {

    }

    /**
     * Remote Logger Popup
     */
    function remoteLoggerPopup() {
        templateRemoteLoggerSettingsModule.showLoggerPopUp();
    }

    /**
    * Show logs Popup
    */
    function showLogsPopup() {
        navigationModule.openPopup(navigationModule.popupPages.logDisplayImportPage);
        setTimeout(() => {
            logDisplayModule.showLogs();
        }, 100);
    }

    /**
     * All public method and properties are exported here
     */
    return {
        onInit,
        remoteLoggerPopup,
        showLogsPopup
    };

}());