(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('jquery'));
    } else {
        factory(window.jQuery);
    }
}(function ($) {
    $.extend(true, $.summernote.lang, {
        'en-US': {/* English */
            videoUpload: {
                dialogTitle: 'Insert Video',
                tooltip: 'Video',
                pluginTitle: 'Video',
                file: 'Select fom files',
                href: 'Video URL',
                ok: 'OK'
            }
        }
    });
    $.extend($.summernote.options, {
        videoUpload: {
            icon: '<i class="note-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="14" height="14"><path d="m 12.503106,4.03105 -3.087752,0 -0.09237,-0.72049 c 0,-0.41163 -0.333714,-0.74534 -0.745341,-0.74534 l -3.180124,0 c -0.411628,0 -0.745342,0.33372 -0.745342,0.74534 l -0.09237,0.72049 -3.062907,0 C 1.22246,4.03105 1,4.24109 1,4.51553 l 0,6.40993 c 0,0.27444 0.22246,0.50932 0.496894,0.50932 l 11.006212,0 C 12.77754,11.43478 13,11.1999 13,10.92546 L 13,4.51553 C 13,4.24109 12.77754,4.03105 12.503106,4.03105 Z M 7.00236,10.77794 c -1.687652,0 -3.055751,-1.3681 -3.055751,-3.05573 0,-1.68765 1.368099,-3.05574 3.055751,-3.05574 1.687652,0 3.055752,1.3681 3.055752,3.05574 0,1.6876 -1.3681,3.05573 -3.055752,3.05573 z m 5.426211,-5.43012 -2.608695,0 0,-0.77017 2.608695,0 0,0.77017 z M 8.876472,7.71575 A 1.8687454,1.8687454 0 0 1 7.007727,9.58449 1.8687454,1.8687454 0 0 1 5.138981,7.71575 1.8687454,1.8687454 0 0 1 7.007727,5.84701 1.8687454,1.8687454 0 0 1 8.876472,7.71575 Z"/></svg></i>',
            extensions: ['mp4'],
            uploadUrl: '/' //Add your upload url
        }
    });
    $.extend($.summernote.plugins, {
        'videoUpload': function (context) {
            var self = this,
                    ui = $.summernote.ui,
                    $editor = context.layoutInfo.editor,
                    $editable = context.layoutInfo.editable,
                    options = context.options,
                    lang = options.langInfo;
            context.memo('button.videoUpload', function () {
                var button = ui.button({
                    contents: options.videoUpload.icon,
                    tooltip: lang.videoUpload.tooltip,
                    click: function (e) {
                        context.invoke('saveRange');
                        context.invoke('videoUpload.show');
                    }
                });
                return button.render();
            });
            this.initialize = function () {
                var $container = options.dialogsInBody ? $(document.body) : $editor;
                var body =
                        '<div class="form-group">' +
                        '  <label for="note-video-href" class="control-label col-xs-3">' + lang.videoUpload.file + '</label>' +
                        '  <div class="input-group col-xs-9">' +
                        '    <input type="file" id="note-video-file" class="note-video-file form-control">' +
                        '  </div>' +
                        '</div>' +
                        '<div class="form-group">' +
                        '  <label for="note-video-href" class="control-label col-xs-3">' + lang.videoUpload.href + '</label>' +
                        '  <div class="input-group col-xs-9">' +
                        '    <input type="text" id="note-video-href" class="note-video-href form-control">' +
                        '  </div>' +
                        '</div>';
                this.$dialog = ui.dialog({
                    title: lang.videoUpload.dialogTitle,
                    body: body,
                    footer: '<button href="#" class="btn btn-primary note-video-btn">' + lang.videoUpload.ok + '</button>'
                }).render().appendTo($container);
            };
            this.destroy = function () {
                ui.hideDialog(this.$dialog);
                this.$dialog.remove();
            };
            this.bindEnterKey = function ($input, $btn) {
                $input.on('keypress', function (e) {
                    if (e.keyCode === 13)
                        $btn.trigger('click');
                });
            };
            this.bindLabels = function () {
                self.$dialog.find('.form-control:first').focus().select();
                self.$dialog.find('label').on('click', function () {
                    $(this).parent().find('.form-control:first').focus();
                });
            };
            this.show = function () {
                var $vid = $($editable.data('target'));
                var vidInfo = {
                    vidDom: $vid,
                    href: $vid.attr('href')
                };
                this.showLinkDialog(vidInfo).then(function (vidInfo) {
                    ui.hideDialog(self.$dialog);
                    var $vid = vidInfo.vidDom,
                            $videoFile = self.$dialog.find('.note-video-file'),
                            $videoHref = self.$dialog.find('.note-video-href'),
                            file = $videoFile.val(),
                            url = $videoHref.val(),
                            $videoHTML = $('<div/>');

                    if (file !== '') {
                        var ext = file.split('.').pop().toLowerCase();
                        if($.inArray(ext, options.videoUpload.extensions) == -1) {
                            alert('Invalid extension!');
                            return;
                        }
                        
                        self.sendFile($videoFile[0].files[0], options.videoUpload.uploadUrl, context);
                    } else {
                        var ytMatch = url.match(/^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/);
                        var igMatch = url.match(/(?:www\.|\/\/)instagram\.com\/p\/(.[a-zA-Z0-9_-]*)/);
                        var vMatch = url.match(/\/\/vine\.co\/v\/([a-zA-Z0-9]+)/);
                        var vimMatch = url.match(/\/\/(player\.)?vimeo\.com\/([a-z]*\/)*([0-9]{6,11})[?]?.*/);
                        var dmMatch = url.match(/.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/);
                        var youkuMatch = url.match(/\/\/v\.youku\.com\/v_show\/id_(\w+)=*\.html/);
                        var mp4Match = url.match(/^.+.(mp4|m4v)$/);
                        var oggMatch = url.match(/^.+.(ogg|ogv)$/);
                        var webmMatch = url.match(/^.+.(webm)$/);
                        var $video;
                        var urlVars = '';

                        if (ytMatch && ytMatch[1].length === 11) {
                            var youtubeId = ytMatch[1];
                            $video = $('<iframe>')
                                    .attr('frameborder', 0)
                                    .attr('src', '//www.youtube.com/embed/' + youtubeId + '?' + urlVars);
                        } else if (igMatch && igMatch[0].length) {
                            $video = $('<iframe>')
                                    .attr('frameborder', 0)
                                    .attr('src', 'https://instagram.com/p/' + igMatch[1] + '/embed/')
                                    .attr('scrolling', 'no')
                                    .attr('allowtransparency', 'true');
                        } else if (vMatch && vMatch[0].length) {
                            $video = $('<iframe>')
                                    .attr('frameborder', 0)
                                    .attr('src', vMatch[0] + '/embed/simple')
                                    .attr('class', 'vine-embed');
                        } else if (vimMatch && vimMatch[3].length) {
                            $video = $('<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen>')
                                    .attr('frameborder', 0)
                                    .attr('src', '//player.vimeo.com/video/' + vimMatch[3] + '?' + urlVars);
                        } else if (dmMatch && dmMatch[2].length) {
                            $video = $('<iframe>')
                                    .attr('frameborder', 0)
                                    .attr('src', '//www.dailymotion.com/embed/video/' + dmMatch[2]);
                        } else if (youkuMatch && youkuMatch[1].length) {
                            $video = $('<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen>')
                                    .attr('frameborder', 0)
                                    .attr('src', '//player.youku.com/embed/' + youkuMatch[1]);
                        } else if (mp4Match || oggMatch || webmMatch) {
                            $video = $('<video controls>')
                                    .attr('src', url);
                        }
                        
                        $video.addClass('note-video-clip');
                        $videoHTML.html($video);
                        context.invoke('restoreRange');
                        context.invoke('editor.insertNode', $videoHTML[0]);
                    }
                });
            };
            this.showLinkDialog = function (vidInfo) {
                return $.Deferred(function (deferred) {
                    var $videoHref = self.$dialog.find('.note-video-href');
                    $editBtn = self.$dialog.find('.note-video-btn');
                    ui.onDialogShown(self.$dialog, function () {
                        context.triggerEvent('dialog.shown');
                        $editBtn.click(function (e) {
                            e.preventDefault();
                            deferred.resolve({
                                vidDom: vidInfo.vidDom,
                                href: $videoHref.val()
                            });
                        });
                        $videoHref.val(vidInfo.href).focus;
                        self.bindEnterKey($editBtn);
                        self.bindLabels();
                    });
                    ui.onDialogHidden(self.$dialog, function () {
                        $editBtn.off('click');
                        if (deferred.state() === 'pending')
                            deferred.reject();
                    });
                    ui.showDialog(self.$dialog);
                });
            };
            this.sendFile = function(file, url, editor) {
                var data = new FormData();
                data.append("file", file);
                data.append("return_path", 'true');
                
                $.ajax({
                    data: data,
                    type: "POST",
                    url: url,
                    cache: false,
                    contentType: false,
                    processData: false,
                    async: false,
                    success: function(objFile) {
                        var $video = $('<iframe>')
                        .attr('frameborder', 0)
                        .attr('src', objFile.url.replace('file/display', 'image/original'));
                            
                        $video.addClass('note-video-clip');
                        $videoHTML = $('<div/>').html($video);
                        context.invoke('restoreRange');
                        context.invoke('editor.insertNode', $videoHTML[0]);
                    },
                    error: function(jqXHR, textStatus, errorThrown)
                    {
                        alert('File not uploaded!');
                    }
                });
            };
        }
    });
}));
