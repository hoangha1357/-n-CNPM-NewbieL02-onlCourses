
FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
);

FilePond.setOptions({ 
    stylePanelAspectRatio: 'auto', 
    imageResizeTargetWidth: 50,
    imageResizeTargetWidth: 50,

})

FilePond.parse(document.body);