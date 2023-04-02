import CoreService from "../core/core.service";

export default class ThemeService extends CoreService {
    constructor(apiUrl) {
      if (!apiUrl) {
        throw new Error('Missing apiUrl argument for service constructor');
      }
      super(apiUrl);
      this.fontFamily = 'Manrope';
    }

    get endpointUrl() {
      return `${this.apiUrl}/theme`;
    }

    get defaultFontFamily() {
      return this.fontFamily;
    }

    async getTheme() {
      try {
        console.log('on fait getTheme');
        const { data } = await this.httpGet(this.endpointUrl);
        // Add fontFamily to nested component(body1,body2, h1, h2...) in object them.typography
        if (data && data?.typography?.fontFamily) {
          const fontFamily = `${data.typography.fontFamily}, ${this.defaultFontFamily}`;
          data.typography = {
            ...data.typography,
            fontFamily,
            ...this.createFontFamily(fontFamily)
          };
        }
        return data ? data : {};
      } catch(e) {
        console.error(e.message);
        // alert("une erroor");
        return {};
      }
    }

    createFontFamily(fontFamily) {
      return {
        h1: { fontFamily },
        h2: { fontFamily },
        h3: { fontFamily },
        h4: { fontFamily },
        h5: { fontFamily },
        h6: { fontFamily },
        subtitle1: { fontFamily },
        subtitle2: { fontFamily },
        body1: { fontFamily },
        body2: { fontFamily },
        button: { fontFamily },
        caption: { fontFamily },
        overline: { fontFamily },
      };
    }
};