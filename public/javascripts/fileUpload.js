FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode
)

FilePond.setOptions({
    stylePanelAspectRatio: 540 / 960,
    imageResizeTargetWidth: 960,
    imageResizeTargetHeight: 540
})

FilePond.parse(document.body);