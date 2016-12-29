/**
 * Copyright 2016 wildbits.github.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

app.utils = app.utils || {};

app.utils.TextUtils = {

    /**
     * Sanitize a text in order to only keep alpha numerical characters.
     * @param text the text to be sanitized
     */
    sanitize : function(text) {
        text = text
            .replace(/[ÀÁÂÃÄÅ]/g, 'A')
            .replace(/[àáâãäå]/g, 'a')
            .replace(/[ÈÉÊË]/g,   'E')
            .replace(/[èéêë]/g,   'e')
            .replace(/[ÎÌÏÍ]/g,   'I')
            .replace(/[Ñ]/g,      'N')
            .replace(/[Š]/g,      'S')
            .replace(/[Ž]/g,      'Z')
            .replace(/[îìï]/g,    'i')
            .replace(/[ÔÒÖÓ]/g,   'O')
            .replace(/[ôòö]/g,    'o')
            .replace(/[ÛÙÜÚ]/g,   'U')
            .replace(/[ÝŸ]/g,     'Y')
            .replace(/[ÿ]/g,      'y')
            .replace(/[ûùü]/g,    'u')
            .replace(/[Ç]/g,      'C')
            .replace(/[ç]/g,      'c');
        return text.replace(/[^0-9a-zA-Z §!"#$%&'()*+,-./:;=@[\]_~|{}™…•°©®]/g, '');
    }

};