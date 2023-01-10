class StickyEdges {
  bufferScroll = 0;
  lastDirection = "";
  $el;
  offset;
  canCompute;
  constructor(el, offset, canCompute = () => true) {
    this.$el = el;
    this.offset = offset;
    this.canCompute = canCompute;
  }
  compute() {
    if (!this.canCompute()) {
      return;
    }
    const { top, overflow } = this.getScrollOptions();
    const delta = this.bufferScroll - window.scrollY;
    this.bufferScroll = window.scrollY;
    const isBottom = delta < 0 && top < overflow;
    const isTop = overflow > 0 || (delta > 0 && top > 0);
    if (isBottom || isTop) {
      if (
        !(isBottom && this.lastDirection === "bottom") &&
        !(isTop && this.lastDirection === "top")
      ) {
        this.bindEdge(isBottom);
      }
    } else if (
      (delta > 0 && this.lastDirection === "bottom") ||
      (delta < 0 && this.lastDirection === "top")
    ) {
      this.unbindEdge(delta);
    }
  }
  getScrollOptions() {
    const bcr = this.$el.getBoundingClientRect();
    const top = bcr.top - this.offset;
    const overflow = window.innerHeight - bcr.height - this.offset * 2;
    return { top, bottom: top - overflow, overflow };
  }
  bindEdge(isBottom) {
    const styles = this.getStyles(isBottom);
    for (const key in styles) {
      this.$el.style.setProperty(key, styles[key]);
    }
    this.lastDirection = isBottom ? "bottom" : "top";
    // console.log(`bind ${this.lastDirection}`);
  }
  unbindEdge(delta) {
    const styles = this.getStyles(false);
    for (const key in styles) {
      this.$el.style.setProperty(key, "");
    }
    const direction = this.lastDirection;
    const dist = this.getScrollOptions()[direction];
    const position = -(dist - delta);
    if (position >= 0) {
      this.$el.style.transform = `translateY(${position}px)`;
    }
    this.lastDirection = "";
    // console.log(`unbind ${this.lastDirection}`);
  }
  getStyles(isBottom) {
    return {
      position: "sticky",
      top: isBottom ? "" : `${this.offset}px`,
      bottom: isBottom ? `${this.offset}px` : "",
      "margin-top": isBottom ? "auto" : "",
      "margin-bottom": isBottom ? "" : "auto",
      transform: "translateY(0)",
    };
  }
}

let listener = () => {
  throw new Error("lisitener is not declared");
};

export default {
  created(el, binding) {
    const stickyEdges = new StickyEdges(el, +binding.arg, binding.value);
    listener = stickyEdges.compute.bind(stickyEdges);
  },
  mounted() {
    window.addEventListener("scroll", listener);
    window.addEventListener("resize", listener);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", listener);
    window.removeEventListener("resize", listener);
  },
};
