// Copyright 2013 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

goog.require('axs.AuditRule');
goog.require('axs.constants.Severity');

/**
 * @type {axs.AuditRule.Spec}
 */
axs.AuditRule.specs.linkWithUnclearPurpose = {
    name: 'linkWithUnclearPurpose',
    heading: 'The purpose of each link should be clear from the link text',
    url: '',
    severity: axs.constants.Severity.WARNING,
    /**
     * @param {Element} element
     * @return {boolean}
     */
    relevantElementMatcher: function(element) {
        return axs.browserUtils.matchSelector(element, 'a');
    },
    /**
     * @param {Element} anchor
     * @param {Object=} opt_config
     * @return {boolean}
     */
    test: function(anchor, opt_config) {
        var config = opt_config || {};
        var blacklistPhrases = config['blacklistPhrases'] || ['click here', 'learn more'];
        var whitespaceRE = /\s+/
        for (var i = 0; i < blacklistPhrases.length; i++) {
            var phraseREString =
                '^\\s*' + blacklistPhrases[i].trim().replace(whitespaceRE, '\\s*') + '\s*[^a-z]$';
            var phraseRE = new RegExp(phraseREString, 'i');
            if (phraseRE.test(anchor.textContent))
                return true;
        }

        var stopwords = config['stopwords'] ||
            ['click', 'tap', 'go', 'here', 'learn', 'more', 'this', 'page', 'link'];
        var filteredText = anchor.textContent;
        filteredText = filteredText.replace(/[^a-zA-Z]/g, '');
        for (var i = 0; i < stopwords.length; i++) {
            var stopwordRE = new RegExp(stopwords[i], 'ig');
            filteredText = filteredText.replace(stopwordRE, '');
            if (filteredText.trim() == '')
                return true;
        }
        return false;
    },
    code: 'AX_TITLE_01'
};
