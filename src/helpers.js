const Helpers = {
    install(Vue, { store }) {

        if (!store) {
            throw new Error("Please provide vuex store.");
        }

        const VuexMethods = [
            'dispatch',
            'commit',
        ];

        const VuexProps = [
            'state',
            'getters'
        ];

        VuexMethods.forEach((method) => {
            Vue.prototype[method] = function () {
                store[method](...arguments);
            }
        });

        VuexProps.forEach((prop) => {
            Vue.prototype[prop] = store[prop];
        });
    }
};


export default Helpers;