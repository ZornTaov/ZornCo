using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Routing;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Encodings.Web;
using System.Threading.Tasks;

namespace Website.Extensions
{
    public static class Extensions
    {
        public static IHtmlContent NavigationLink(
            this IHtmlHelper html,
            string linkText,
            string actionName,
            string controllerName,
            object routeValues,
            object htmlAttributes, 
            bool light = false)
        {
            string contextAction = (string)html.ViewContext.RouteData.Values["action"];
            string contextController = (string)html.ViewContext.RouteData.Values["controller"];
            string contextID = ((string)html.ViewContext.RouteData.Values["id"]) ?? string.Empty;
            RouteValueDictionary rvd = new RouteValueDictionary(routeValues);
            string idName = ((string)rvd["id"]) ?? string.Empty;
            bool isCurrent =
                string.Equals(contextAction, actionName, StringComparison.CurrentCultureIgnoreCase) &&
                string.Equals(contextController, controllerName, StringComparison.CurrentCultureIgnoreCase) &&
                string.Equals(contextID, idName);

            using var writer = new StringWriter();
            writer.WriteLine($"<li class='nav-item{(isCurrent ? " active" + (light ? "-header" : "-dropdown") : "")}'>");
            html.ActionLink(
            linkText,
            actionName,
            controllerName,
            routeValues,
            htmlAttributes).WriteTo(writer, HtmlEncoder.Default);
            writer.WriteLine("</li>");
            return new HtmlString(writer.ToString());
        }
    }
}
