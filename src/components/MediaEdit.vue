<template>
    <div class="media-edit">
        <input ref="input" class="media-edit--input" type="file" @change="setMedia">
        <div class="media-edit--preview" v-if="media.file">
            <div class="media-edit--remove">
                <button @click="removeMedia">Remove media</button>
            </div>
            <img   v-if="media.type === 'image'"      :src="previewMedia(media.file)" alt="">
            <audio v-else-if="media.type === 'audio'" :src="previewMedia(media.file)" controls preload="auto"></audio>
            <video v-else-if="media.type === 'video'" :src="previewMedia(media.file)" controls preload="auto"></video>
        </div>
    </div>
</template>

<script>
    const getDefaultMedia = () => ({});

    export default {
        name: 'MediaEdit',
        props: {
            value: {
                type: Object,
                default: getDefaultMedia
            }
        },
        data() {
            return {
                media: this.$props.value,
            }
        },
        methods: {
            setMedia($event) {
                const file = $event.target.files[0];
                if (!file) this.removeMedia();

                const filetype = file.type;
                let type;
                ['image', 'video', 'audio']
                    .some(val => filetype?.indexOf(val) > -1 && (type = val));

                this.media = {
                    file,
                    type,
                    extension: file.name?.split('.').pop(),
                };

                this.bubble();
            },
            removeMedia() {
                const ref = this.$refs['input'];
                if (ref) ref.value = '';
                this.media = getDefaultMedia();

                this.bubble();
            },
            previewMedia(File) {
                if (typeof File === 'object') return URL.createObjectURL(File);
                return File;
            },
            bubble() {
                this.$emit('input', this.media);
            }
        }
    }
</script>
