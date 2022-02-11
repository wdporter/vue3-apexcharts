/* eslint-disable */

// define all emitted events in order to better
// document how the component should work
const events = [
  "animationEnd",
  "beforeMount",
  "mounted",
  "updated",
  "click",
  "mouseMove",
  "mouseLeave",
  "legendClick",
  "markerClick",
  "selection",
  "dataPointSelection",
  "dataPointMouseEnter",
  "dataPointMouseLeave",
  "beforeZoom",
  "beforeResetZoom",
  "zoomed",
  "scrolled",
  "brushScrolled"
];

const vueApexcharts = Vue.defineComponent({
  name: "apexchart",
  props: {
    options: {
      type: Object
    },
    type: {
      type: String
    },
    series: {
      type: Array,
      required: true
    },
    width: {
      default: "100%"
    },
    height: {
      default: "auto"
    }
  },

  // events emitted by this component
  emits: events,

  setup(props, { emit }) {
    const __el = Vue.ref(null);
    const chart = Vue.ref(null);

    const isObject = item => {
      return item && typeof item === "object" && !Array.isArray(item) && item != null;
    };

    const extend = (target, source) => {
      if (typeof Object.assign !== "function") {
        (function() {
          Object.assign = function(target) {
            // We must check against these specific cases.
            if (target === undefined || target === null) {
              throw new TypeError("Cannot convert undefined or null to object");
            }

            let output = Object(target);
            for (let index = 1; index < arguments.length; index++) {
              let source = arguments[index];
              if (source !== undefined && source !== null) {
                for (let nextKey in source) {
                  if (source.hasOwnProperty(nextKey)) {
                    output[nextKey] = source[nextKey];
                  }
                }
              }
            }
            return output;
          };
        })();
      }

      let output = Object.assign({}, target);
      if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
          if (isObject(source[key])) {
            if (!(key in target)) {
              Object.assign(output, {
                [key]: source[key]
              });
            } else {
              output[key] = extend(target[key], source[key]);
            }
          } else {
            Object.assign(output, {
              [key]: source[key]
            });
          }
        });
      }
      return output;
    };

    const init = async () => {
      await Vue.nextTick();

      const newOptions = {
        chart: {
          type: props.type || props.options.chart.type || "line",
          height: props.height,
          width: props.width,
          events: {}
        },
        series: props.series
      };

      // emit events to the parent component
      // to allow for two-way data binding
      events.forEach(event => {
        let callback = (...args) => emit(event, ...args); // args => chartContext, options
        newOptions.chart.events[event] = callback;
      });

      const config = extend(props.options, newOptions);
      chart.value = new ApexCharts(__el.value, config);
      return chart.value.render();
    };

    const refresh = () => {
      destroy();
      return init();
    };

    const destroy = () => {
      chart.value.destroy();
    };

    const updateSeries = (newSeries, animate) => {
      return chart.value.updateSeries(newSeries, animate);
    };

    const updateOptions = (newOptions, redrawPaths, animate, updateSyncedCharts) => {
      return chart.value.updateOptions(newOptions, redrawPaths, animate, updateSyncedCharts);
    };

    const toggleSeries = seriesName => {
      return chart.value.toggleSeries(seriesName);
    };

    const showSeries = seriesName => {
      chart.value.showSeries(seriesName);
    };

    const hideSeries = seriesName => {
      chart.value.hideSeries(seriesName);
    };

    const appendSeries = (newSeries, animate) => {
      return chart.value.appendSeries(newSeries, animate);
    };

    const resetSeries = () => {
      chart.value.resetSeries();
    };

    const toggleDataPointSelection = (seriesIndex, dataPointIndex) => {
      chart.value.toggleDataPointSelection(seriesIndex, dataPointIndex);
    };

    const appendData = newData => {
      return chart.value.appendData(newData);
    };

    const zoomX = (start, end) => {
      return chart.value.zoomX(start, end);
    };

    const dataURI = options => {
      return chart.value.dataURI(options);
    };

    const setLocale = localeName => {
      return chart.value.setLocale(localeName);
    };

    const addXaxisAnnotation = (options, pushToMemory) => {
      chart.value.addXaxisAnnotation(options, pushToMemory);
    };

    const addYaxisAnnotation = (options, pushToMemory) => {
      chart.value.addYaxisAnnotation(options, pushToMemory);
    };

    const addPointAnnotation = (options, pushToMemory) => {
      chart.value.addPointAnnotation(options, pushToMemory);
    };

    const removeAnnotation = (id, options) => {
      chart.value.removeAnnotation(id, options);
    };

    const clearAnnotations = () => {
      chart.value.clearAnnotations();
    };

    Vue.onBeforeMount(() => {
      window.ApexCharts = ApexCharts;
    });

    Vue.onMounted(() => {
      __el.value = Vue.getCurrentInstance().proxy.$el;
      init();
    });

    Vue.onBeforeUnmount(() => {
      if (!chart.value) {
        return;
      }
      destroy();
    });

    const reactiveProps = Vue.toRefs(props);
    Vue.watch(reactiveProps.options, () => {
      if (!chart.value && props.options) {
        init();
      } else {
        chart.value.updateOptions(props.options);
      }
    });

    Vue.watch(
      reactiveProps.series,
      () => {
        if (!chart.value && props.series) {
          init();
        } else {
          chart.value.updateSeries(props.series);
        }
      },
      { deep: true }
    );

    Vue.watch(reactiveProps.type, () => {
      refresh();
    });

    Vue.watch(reactiveProps.width, () => {
      refresh();
    });

    Vue.watch(reactiveProps.height, () => {
      refresh();
    });

    return {
      chart,
      init,
      refresh,
      destroy,
      updateOptions,
      updateSeries,
      toggleSeries,
      showSeries,
      hideSeries,
      resetSeries,
      zoomX,
      toggleDataPointSelection,
      appendData,
      appendSeries,
      addXaxisAnnotation,
      addYaxisAnnotation,
      addPointAnnotation,
      removeAnnotation,
      clearAnnotations,
      setLocale,
      dataURI
    };
  },

  render() {
    return Vue.h("div", {
      class: "vue-apexcharts"
    });
  }
});

