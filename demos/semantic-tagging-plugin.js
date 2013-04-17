annotorious.plugin.SemanticTagging = function(opt_config_options) {
  /** @private **/
  this._tags = [];

  /** @private **/
  this._ENDPOINT_URI = opt_config_options['endpoint_url'];

  if (this._ENDPOINT_URI[this._ENDPOINT_URI.length - 1] != '/')
    this._ENDPOINT_URI += '/';

  this._ENDPOINT_URI += 
    'services/wikify?minProbability=0.1&disambiguationPolicy=loose&responseFormat=json&source=';
}

annotorious.plugin.SemanticTagging.prototype.onInitAnnotator = function(annotator) {
  // Popup extension: show existing tags
  annotator.popup.addField(function(annotation) {
    var popupContainer = document.createElement('div');
    if (annotation.tags) {
      jQuery.each(annotation.tags, function(idx, tag) {
        var el = document.createElement('a');
        el.href = '#';
        el.className = 'semantic-tag';
        el.innerHTML = tag.title;
        popupContainer.appendChild(el);
      });
    }
    return popupContainer;
  });

  // Editor, step 1 - add a key listener
  var self = this;
  var container = document.createElement('div');
  annotator.editor.element.addEventListener('keyup', function(event) {
    var annotation = annotator.editor.getAnnotation();
    var text = annotation.text;

    if (text.length > 5 && text[text.length - 1] == ' ' || text[text.length - 1] == '.') {
      jQuery.getJSON(self._ENDPOINT_URI + text, function(data) {
        if (data.detectedTopics.length > 0) {
          jQuery.each(data.detectedTopics, function(idx, topic) {
            // If the tag is not in the list of suggestions yet, add it now
            if (!self._tags[topic.id]) {
              self._tags[topic.id] = topic;

              var link = document.createElement('a');
              link.href = '#';
              link.innerHTML = topic.title;
              container.appendChild(link);

              // TODO click should toggle, rather than add (and add, and add, and add...)
              jQuery(link).addClass('semantic-tag').click(function() {
                if (!annotation.tags)
                  annotation.tags = [];
                
                annotation.tags.push(topic);
                jQuery(link).addClass('selected');
              });
            }
          });
        }
      });
    }
  });

  // Editor, step 2 - add a field (that empties itself)
  annotator.editor.addField(function(annotation) {
    container.innerHTML = '';

    // TODO this should list existing tags, not empty

    return container;
  });
}
