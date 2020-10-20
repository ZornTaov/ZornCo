using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Website.Controllers;
using Website.Json;

namespace Website.ViewComponents
{
    public class MenuBarViewComponent : ViewComponent
    {
        private readonly Projects p;
        public MenuBarViewComponent(Projects p)
        {
            this.p = p;
        }

        public IViewComponentResult Invoke()
        {
            //TODO: add image/youtube badges to nav-item
            return View(this.p);
        }
    }
}
