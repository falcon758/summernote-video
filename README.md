# summernote-video
A plugin for the [Summernote](https://github.com/summernote/summernote/) WYSIWYG editor.

Adds a button to the Summernote Toolbar that allows upload/insert video and some embedding attribute.

### Installation

#### 1. Include JS

Include the following code after Summernote:

```html
<script src="summernote-video.js"></script>
```

#### 2. Supported languages

Currently available in English.

#### 3. Summernote options

Finally, customize the Summernote video popover.

```javascript
$(document).ready(function() {
    $('#summernote').summernote({
        toolbar:[
            ... Your other toolbar options
            ['insert', ['videoUpload']],
            ... Your other toolbar options
    ]
    });
});
```

#### 4. Thanks
- Thanks to DiemenDesign
