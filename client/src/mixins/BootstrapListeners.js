export default {
  created() {
    this.listeners = {
      hide: () => this.$emit('hide'),
      hidden: () => this.$emit('hidden'),
      hidePrevented: () => this.$emit('hidePrevented'),
      show: () => this.$emit('show'),
      shown: () => this.$emit('shown')
    }
  },
  mounted() {
    Object.entries(this.listeners).forEach(([key, value]) => {
      this.$el.addEventListener(`${key}.bs.${this.bsType}`, value);
    });
  },
  beforeUnmount() {
    Object.entries(this.listeners).forEach(([key, value]) => {
      this.$el.removeEventListener(`${key}.bs.${this.bsType}`, value);
    });
  }
}