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
        private readonly IWebHostEnvironment _env;
        public readonly List<ProjectJson> projects;
        public MenuBarViewComponent()
        {

        }
        public IViewComponentResult Invoke(int numberOfItems)
        {
            return View(HomeController.projects);
        }
    }
}
