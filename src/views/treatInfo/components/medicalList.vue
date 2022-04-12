<template>
  <div class="zybasy" style="padding-bottom: 200px">
    <div
      class="details-body"
      style="margin-top: 0; padding-top: 20px; top: 20px"
    >
      <table class="zybasy-table">
        <tr>
          <td style="width: 30px"></td>
          <td style="width: 30px"></td>
          <td style="width: 30px"></td>
          <td style="width: 30px"></td>
          <td style="width: 30px"></td>
          <td style="width: 30px"></td>
          <td style="width: 30px"></td>
          <td style="width: 30px"></td>
          <td style="width: 30px"></td>
          <td style="width: 30px"></td>
          <td style="width: 30px"></td>
          <td style="width: 30px"></td>
          <td style="width: 30px"></td>
          <td style="width: 30px"></td>
          <td style="width: 30px"></td>
          <td style="width: 30px"></td>
          <td style="width: 30px"></td>
          <td style="width: 30px"></td>
          <td style="width: 30px"></td>
          <td style="width: 30px"></td>
          <td style="width: 30px"></td>
          <td style="width: 30px"></td>
          <td style="width: 30px"></td>
          <td style="width: 30px"></td>
        </tr>
        <tr>
          <td
            colspan="24"
            style="text-align: center; font-size: 13px; font-weight: bold"
          >
            <span
              >医疗机构：<span style="font-weight: normal">{{
                findByJzlshAndYljgdmList.yljgmc
              }}</span></span
            >
            <span id="yljgmc" class="info-value"></span>
            <span
              >（<span class=""
                >组织机构代码：{{ findByJzlshAndYljgdmList.yljgdm }}</span
              ><span id="yljgdm" class="info-value"></span>）</span
            >
          </td>
        </tr>
        <tr>
          <td colspan="10">
            <span class="padding-left-5"
              >医疗付费方式：{{ findByJzlshAndYljgdmList.ylfffsmc
              }}<span id="ylfffsmc"></span
            ></span>
          </td>
          <td colspan="14">
            <span style="font-size: 13px; font-weight: bolder"
              >住&nbsp;&nbsp;院&nbsp;&nbsp;病&nbsp;&nbsp;案&nbsp;&nbsp;首&nbsp;&nbsp;页</span
            >
          </td>
        </tr>
        <tr>
          <td colspan="12">
            <span class="padding-left-5"
              >健康卡号：{{ findByJzlshAndYljgdmList.jkkh
              }}<span id="jkkh"></span
            ></span>
          </td>
          <td colspan="6">
            <span
              >第<span id="zycs">{{ findByJzlshAndYljgdmList.zycs }}</span
              >次住院</span
            >
          </td>
          <td colspan="6">
            <span
              >病案号：{{ findByJzlshAndYljgdmList.bah }}<span id="bah"></span
            ></span>
          </td>
        </tr>
        <tr style="border-top: 1px solid white">
          <td colspan="5">
            <span class="padding-left-5"
              ><span class="font-weight-bold"
                >姓名：{{ findByJzlshAndYljgdmList.hzxm }}</span
              ><span id="hzxm"></span
            ></span>
          </td>
          <td colspan="5">
            <span
              ><span class="font-weight-bold"
                >性别：{{ findByJzlshAndYljgdmList.xbmc }}</span
              ><span id="xbmc"></span
            ></span>
          </td>
          <td colspan="6">
            <span
              ><span class="font-weight-bold"
                >出生日期：{{
                  findByJzlshAndYljgdmList.csrq | dateFormat
                }}</span
              ><span id="csrq"></span
            ></span>
          </td>
          <td colspan="4">
            <span
              ><span class="font-weight-bold"
                >年龄：{{ findByJzlshAndYljgdmList.brnl }}</span
              ><span id="brnl"></span
            ></span>
          </td>
          <td colspan="4">
            <span
              ><span class="font-weight-bold"
                >国籍：{{ findByJzlshAndYljgdmList.gjmc }}</span
              ><span id="gjmc"></span
            ></span>
          </td>
        </tr>
        <tr>
          <td colspan="5">
            <span class="padding-left-5">（年龄不足1周岁的）</span>
          </td>
          <td colspan="5">
            <span
              ><span class="font-weight-bold"
                >年龄：{{ findByJzlshAndYljgdmList.nlBaby }}</span
              ><span id="brnl_2"></span
            ></span>
          </td>
          <td colspan="6">
            <span
              ><span class="font-weight-bold"
                >新生儿出生体重：{{ findByJzlshAndYljgdmList.xsecstz }}</span
              ><span id="xsecstz"></span>克</span
            >
          </td>
          <td colspan="8">
            <span
              ><span class="font-weight-bold"
                >新生儿入院体重：{{ findByJzlshAndYljgdmList.xserytz }}</span
              ><span id="xserytz"></span>克</span
            >
          </td>
        </tr>
        <tr>
          <td colspan="10">
            <span class="padding-left-5"
              ><span class="font-weight-bold"
                >出生地：{{ findByJzlshAndYljgdmList.csdzSsmc }}</span
              ><span id="csdzSsmc"></span
            ></span>
          </td>
          <td colspan="10">
            <span
              ><span class="font-weight-bold"
                >籍贯：{{ findByJzlshAndYljgdmList.jgssmc }}</span
              ><span id="jgssmc"></span
            ></span>
          </td>
          <td colspan="4">
            <span
              ><span class="font-weight-bold"
                >民族：{{ findByJzlshAndYljgdmList.mzmc }}</span
              ><span id="mzmc"></span
            ></span>
          </td>
        </tr>
        <tr>
          <td colspan="10">
            <span class="padding-left-5"
              ><span class="font-weight-bold"
                >身份证号：{{ findByJzlshAndYljgdmList.zjhm }}</span
              ><span id="zjhm"></span
            ></span>
          </td>
          <td colspan="10">
            <span
              ><span class="font-weight-bold"
                >职业：{{ findByJzlshAndYljgdmList.zymc }}</span
              ><span id="zymc"></span
            ></span>
          </td>
          <td colspan="4">
            <span
              ><span class="font-weight-bold"
                >婚姻：{{ findByJzlshAndYljgdmList.jzdz }}</span
              ><span id="hyzk"></span
            ></span>
          </td>
        </tr>
        <tr>
          <td colspan="12">
            <span class="padding-left-5"
              ><span class="font-weight-bold"
                >现住址：{{ findByJzlshAndYljgdmList.jzdz }}</span
              ><span id="jzdz"></span
            ></span>
          </td>
          <td colspan="8">
            <span
              ><span class="font-weight-bold"
                >电话：{{ findByJzlshAndYljgdmList.xzzdh }}</span
              ><span id="xzzdh"></span
            ></span>
          </td>
          <td colspan="4">
            <span
              ><span class="font-weight-bold"
                >邮编：{{ findByJzlshAndYljgdmList.xzzyb }}</span
              ><span id="xzzyb"></span
            ></span>
          </td>
        </tr>
        <tr>
          <td colspan="20">
            <span class="padding-left-5"
              ><span class="font-weight-bold"
                >户口地址：{{ findByJzlshAndYljgdmList.hkdz }}</span
              ><span id="hkdz"></span
            ></span>
          </td>
          <td colspan="4">
            <span
              ><span class="font-weight-bold"
                >邮编：{{ findByJzlshAndYljgdmList.hkyb }}</span
              ><span id="hkyb"></span
            ></span>
          </td>
        </tr>
        <tr>
          <td colspan="12">
            <span class="padding-left-5"
              ><span class="font-weight-bold"
                >工作单位及地址：{{ findByJzlshAndYljgdmList.dwdz }}</span
              ><span id="dwdz"></span
            ></span>
          </td>
          <td colspan="8">
            <span
              ><span class="font-weight-bold"
                >单位电话：{{ findByJzlshAndYljgdmList.dwdh }}</span
              ><span id="dwdh"></span
            ></span>
          </td>
          <td colspan="4">
            <span
              ><span class="font-weight-bold"
                >邮编：{{ findByJzlshAndYljgdmList.dwyb }}</span
              ><span id="dwyb"></span
            ></span>
          </td>
        </tr>
        <tr>
          <td colspan="5">
            <span class="padding-left-5"
              ><span class="font-weight-bold"
                >联系人姓名：{{ findByJzlshAndYljgdmList.lxrxm }}</span
              ><span id="lxrxm"></span
            ></span>
          </td>
          <td colspan="5">
            <span
              ><span class="font-weight-bold"
                >关系：{{ findByJzlshAndYljgdmList.lxgxmc }}</span
              ><span id="lxgxmc"></span
            ></span>
          </td>
          <td colspan="8">
            <span
              ><span class="font-weight-bold"
                >地址：{{ findByJzlshAndYljgdmList.lxrdz }}</span
              ><span id="lxrdz"></span
            ></span>
          </td>
          <td colspan="6">
            <span
              ><span class="font-weight-bold"
                >电话：{{ findByJzlshAndYljgdmList.lxrdh }}</span
              ><span id="lxrdh"></span
            ></span>
          </td>
        </tr>
        <tr>
          <td colspan="8">
            <span class="padding-left-5"
              ><span class="font-weight-bold"
                >入院途径：{{ findByJzlshAndYljgdmList.rytjmc }}</span
              ><span id="rytjmc"></span
            ></span>
          </td>
          <td colspan="8">
            <span class="padding-left-5"
              ><span class="font-weight-bold"
                >病历分型：{{
                  findByJzlshAndYljgdmList.blfxmc
                    ? findByJzlshAndYljgdmList.blfxmc
                    : '--'
                }}</span
              ><span id="blfxmc"></span
            ></span>
          </td>
          <td colspan="8">
            <span
              ><span class="font-weight-bold"
                >入院后确诊日期：{{
                  findByJzlshAndYljgdmList.ryhqzrq | dateFormat
                }}</span
              ><span id="ryhqzrq"></span
            ></span>
          </td>
        </tr>
        <tr>
          <td colspan="8" style="vertical-align: bottom">
            <span class="padding-left-5"
              ><span class="font-weight-bold"
                >入院时间：{{
                  findByJzlshAndYljgdmList.rysj | dateFormat
                }}</span
              ><span id="rysj"></span
            ></span>
          </td>
          <td colspan="5" style="vertical-align: bottom">
            <span
              ><span class="font-weight-bold"
                >入院科别：{{ findByJzlshAndYljgdmList.ryksmc }}</span
              ><span id="ryksmc"></span
            ></span>
          </td>
          <td colspan="5" style="vertical-align: bottom">
            <span
              ><span class="font-weight-bold"
                >病房：{{ findByJzlshAndYljgdmList.rybf }}</span
              ><span id="rybf"></span
            ></span>
          </td>
          <td colspan="6">
            <span class="font-weight-bold">
              转科科别：
              <div
                v-for="item in findByJzlshAndYljgdmList.hzlzxxList"
                :key="item.id"
              >
                {{ item.ksmc }}
                →
              </div>
              <span><div id="zzksmc" style="display: inline-block"></div></span
            ></span>
          </td>
        </tr>
        <tr>
          <td colspan="8">
            <span class="padding-left-5"
              ><span class="font-weight-bold"
                >出院时间：{{
                  findByJzlshAndYljgdmList.cysj | dateFormat
                }}</span
              ><span id="cysj"></span
            ></span>
          </td>
          <td colspan="5">
            <span
              ><span class="font-weight-bold"
                >出院科别：{{ findByJzlshAndYljgdmList.cyksmc }}</span
              ><span id="cyksmc"></span
            ></span>
          </td>
          <td colspan="5">
            <span
              ><span class="font-weight-bold"
                >病房：{{ findByJzlshAndYljgdmList.cybf }}</span
              ><span id="cybf"></span
            ></span>
          </td>
          <td colspan="6">
            <span
              ><span class="font-weight-bold"
                >实际住院：{{ findByJzlshAndYljgdmList.zyts }}</span
              ><span id="zyts"></span>天</span
            >
          </td>
        </tr>
        <tr>
          <td colspan="13">
            <span class="padding-left-5"
              ><span class="font-weight-bold"
                >门（急）诊诊断：{{ findByJzlshAndYljgdmList.mjzzdmc }}</span
              ><span id="mjzzdmc"></span
            ></span>
          </td>
          <td colspan="11">
            <span
              ><span class="font-weight-bold"
                >疾病编码：{{ findByJzlshAndYljgdmList.mjzzddm }}</span
              ><span id="mjzzddm"></span
            ></span>
          </td>
        </tr>
        <tr
          style="
            border-top: 1px solid white;
            text-align: center;
            font-weight: bold;
            height: 38px;
          "
        >
          <td colspan="6" style="border-right: 1px solid white">出院诊断</td>
          <td colspan="2" style="border-right: 1px solid white">疾病编码</td>
          <td colspan="2" style="border-right: 1px solid white">入院病情</td>
          <td colspan="2" style="border-right: 1px solid white">出院情况</td>
          <td colspan="6" style="border-right: 1px solid white">出院诊断</td>
          <td colspan="2" style="border-right: 1px solid white">疾病编码</td>
          <td colspan="2" style="border-right: 1px solid white">入院病情</td>
          <td colspan="2">出院情况</td>
        </tr>
        <!-- 后台数据返回变化不断，有点奇怪 -->
        <tr
          style="border-top: 1px solid white"
          v-for="item in findByJzlshAndYljgdmList.zybasyzdxxList"
          :key="item.id"
        >
          <td colspan="6" style="border-right: 1px solid white">
            <span
              ><span class="padding-left-5 font-weight-bold"
                >{{ item.id === 1 ? '主要诊断' : '其它诊断' }} :
                {{ item.zdmc }}</span
              ><span
                id="zdmc_1"
                class="zdxx"
                style="
                  word-wrap: break-word;
                  word-break: break-all;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: normal;
                "
              ></span
            ></span>
          </td>
          <td colspan="2" style="border-right: 1px solid white">
            <span
              class="padding-left-5 zdxx"
              id="zddm_1"
              style="
                word-wrap: break-word;
                word-break: break-all;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: normal;
              "
              >{{ item.zddm }}</span
            >
          </td>
          <td
            colspan="2"
            style="border-right: 1px solid white; text-align: center"
          >
            <span id="rybqdm_1" class="zdxx">{{
              item.rybqmc ? item.rybqmc : '--'
            }}</span>
          </td>
          <td
            colspan="2"
            style="border-right: 1px solid white; text-align: center"
          >
            <span id="zgqkmc_1" class="zdxx"
              >{{ item.zgqkmc ? item.zgqkmc : '--' }}
            </span>
          </td>
          <td colspan="6" style="border-right: 1px solid white">
            <span
              ><span class="padding-left-5 font-weight-bold"
                >{{ item.id === 1 ? '其它诊断:' : '' }} </span
              ><span
                id="zdmc_9"
                class="zdxx"
                style="
                  word-wrap: break-word;
                  word-break: break-all;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: normal;
                "
              ></span
            ></span>
          </td>
          <td colspan="2" style="border-right: 1px solid white">
            <span
              class="padding-left-5 zdxx"
              id="zddm_9"
              style="
                word-wrap: break-word;
                word-break: break-all;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: normal;
              "
            ></span>
          </td>
          <td
            colspan="2"
            style="border-right: 1px solid white; text-align: center"
          >
            <span id="rybqdm_9" class="zdxx"></span>
          </td>
          <td colspan="2" style="text-align: center">
            <span id="zgqkmc_9" class="zdxx"></span>
          </td>
        </tr>

        <tr style="border-top: 1px solid white">
          <td colspan="6" style="border-right: 1px solid white">
            <span
              ><span class="padding-left-5 font-weight-bold"></span
              ><span
                id="zdmc_8"
                class="zdxx"
                style="
                  word-wrap: break-word;
                  word-break: break-all;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: normal;
                "
              ></span
            ></span>
          </td>
          <td colspan="2" style="border-right: 1px solid white">
            <span
              class="padding-left-5 zdxx"
              id="zddm_8"
              style="
                word-wrap: break-word;
                word-break: break-all;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: normal;
              "
            ></span>
          </td>
          <td
            colspan="2"
            style="border-right: 1px solid white; text-align: center"
          >
            <span id="rybqdm_8" class="zdxx"></span>
          </td>
          <td
            colspan="2"
            style="border-right: 1px solid white; text-align: center"
          >
            <span id="zgqkmc_8" class="zdxx"></span>
          </td>
          <td colspan="6" style="border-right: 1px solid white">
            <span
              ><span class="padding-left-5 font-weight-bold"></span
              ><span id="zdmc_16" class="zdxx"></span
            ></span>
          </td>
          <td colspan="2" style="border-right: 1px solid white">
            <span class="padding-left-5 zdxx" id="zddm_16"></span>
          </td>
          <td
            colspan="2"
            style="border-right: 1px solid white; text-align: center"
          >
            <span id="rybqdm_16" class="zdxx"></span>
          </td>
          <td colspan="2" style="text-align: center">
            <span id="zgqkmc_16" class="zdxx"></span>
          </td>
        </tr>

        <tr style="border-top: 1px solid white">
          <td colspan="24" style="border-right: 1px solid white">
            <span
              ><span class="padding-left-5 font-weight-bold">入院病情：</span
              ><span>1.有，2.临床未确定，3.情况不明，4.无</span></span
            >
          </td>
          <!--<td colspan="7" style="border-right: 1px solid white;"></td>-->
          <!--<td colspan="3" style="border-right: 1px solid white;"></td>-->
          <!--<td colspan="2" style="text-align: center;"></td>-->
        </tr>
        <tr style="border-top: 1px solid white">
          <td colspan="18">
            <span
              ><span class="padding-left-5 font-weight-bold"
                >损伤、中毒的外部原因：{{
                  findByJzlshAndYljgdmList.sszdwbyymc
                }}</span
              ><span id="sszdwbyymc"></span
            ></span>
          </td>
          <td colspan="6">
            <span
              ><span class="font-weight-bold"
                >疾病编码：{{ findByJzlshAndYljgdmList.sszdwbyydm }}</span
              ><span id="sszdwbyydm"></span
            ></span>
          </td>
        </tr>
        <tr style="border-top: 1px solid white">
          <td colspan="12">
            <span
              ><span class="padding-left-5 font-weight-bold"
                >病理诊断：{{ findByJzlshAndYljgdmList.blzdmc }}</span
              ><span id="blzdmc"></span
            ></span>
          </td>
          <td colspan="6">
            <span
              ><span class="font-weight-bold"
                >病理号：{{ findByJzlshAndYljgdmList.blh }}</span
              ><span id="blh"></span
            ></span>
          </td>
          <td colspan="6">
            <span
              ><span class="font-weight-bold"
                >疾病编码：{{ findByJzlshAndYljgdmList.blzddm }}</span
              ><span id="blzddm"></span
            ></span>
          </td>
        </tr>
        <tr style="border-top: 1px solid white">
          <td colspan="18">
            <span
              ><span class="padding-left-5 font-weight-bold"
                >药物过敏：{{ findByJzlshAndYljgdmList.yw }}</span
              ><span id="ywgmbz"></span>，<span class="font-weight-bold"
                >过敏药物：{{ findByJzlshAndYljgdmList.gmyw }}</span
              ><span id="gmyw"></span
            ></span>
          </td>
          <td colspan="6">
            <span
              ><span class="font-weight-bold"
                >死亡患者尸检：{{ findByJzlshAndYljgdmList.swhzsjbz }}</span
              ><span id="swhzsjbz"></span
            ></span>
          </td>
        </tr>
        <tr style="border-top: 1px solid white">
          <td colspan="7">
            <span
              ><span class="padding-left-5 font-weight-bold"
                >血型：{{ findByJzlshAndYljgdmList.aboxx }}</span
              ><span id="aboxx"></span>，<span class="font-weight-bold"
                >Rh ：{{ findByJzlshAndYljgdmList.rhdxx }}</span
              ><span id="rhdxx"></span
            ></span>
          </td>
          <td colspan="17">
            <span
              ><span class="font-weight-bold"
                >输血反应：{{ findByJzlshAndYljgdmList.sxfy }}</span
              ><span id="sxfy"></span
            ></span>
          </td>
        </tr>
        <tr style="border-top: 1px solid white">
          <td colspan="5">
            <span
              ><span class="padding-left-5 font-weight-bold"
                >科主任：{{ findByJzlshAndYljgdmList.zrysmc }}</span
              ><span id="zrysmc"></span
            ></span>
          </td>
          <td colspan="7">
            <span
              ><span class="font-weight-bold"
                >主任（副主任）医师 ：{{
                  findByJzlshAndYljgdmList.fzrysmc
                }}</span
              ><span id="fzrysmc"></span
            ></span>
          </td>
          <td colspan="5">
            <span
              ><span class="font-weight-bold"
                >主治医师：{{ findByJzlshAndYljgdmList.zzysmc }}</span
              ><span id="zzysmc"></span
            ></span>
          </td>
          <td colspan="7">
            <span
              ><span class="font-weight-bold"
                >住院医师：{{ findByJzlshAndYljgdmList.zyysmc }}</span
              ><span id="zyysmc"></span
            ></span>
          </td>
        </tr>
        <tr>
          <td colspan="5">
            <span
              ><span class="padding-left-5 font-weight-bold"
                >责任护士：{{ findByJzlshAndYljgdmList.zrhsmc }}</span
              ><span id="zrhsmc"></span
            ></span>
          </td>
          <td colspan="7">
            <span
              ><span class="font-weight-bold"
                >进修医师：{{ findByJzlshAndYljgdmList.zrhsmc }}</span
              ><span id="jxysmc"></span
            ></span>
          </td>
          <td colspan="5">
            <span
              ><span class="font-weight-bold"
                >实习医师：{{ findByJzlshAndYljgdmList.sxysmc }}</span
              ><span id="sxysmc"></span
            ></span>
          </td>
          <td colspan="7">
            <span
              ><span class="font-weight-bold"
                >编码员：{{ findByJzlshAndYljgdmList.bmyqm }}</span
              ><span id="bmyqm"></span
            ></span>
          </td>
        </tr>
        <tr style="border-top: 1px solid white">
          <td colspan="5">
            <span
              ><span class="padding-left-5 font-weight-bold"
                >病案质量：{{ findByJzlshAndYljgdmList.bazlmc }}</span
              ><span id="bazlmc"></span
            ></span>
          </td>
          <td colspan="7">
            <span
              ><span class="font-weight-bold"
                >质控医师：{{ findByJzlshAndYljgdmList.zkysmc }}</span
              ><span id="zkysmc"></span
            ></span>
          </td>
          <td colspan="5">
            <span
              ><span class="font-weight-bold"
                >质控护士：{{ findByJzlshAndYljgdmList.zkhsmc }}</span
              ><span id="zkhsmc"></span
            ></span>
          </td>
          <td colspan="7">
            <span
              ><span class="font-weight-bold"
                >质控日期：{{
                  findByJzlshAndYljgdmList.zkrq | dateFormat
                }}</span
              ><span id="zkrq"></span
            ></span>
          </td>
        </tr>
        <tr style="border-top: 1px solid white; height: 15px">
          <td colspan="24"></td>
        </tr>
        <!-- 修改第二个表格样式 -->
        <tr>
          <td colspan="24">
            <div id="ss-div" style="height: 276px; overflow-y: auto">
              <div id="ss-div">
                <table id="ss-table" style="width: 100%; table-layout: fixed">
                  <tr
                    style="
                      font-size: 12px;
                      border-top: 1px solid white;
                      font-weight: bold;
                      text-align: center;
                    "
                  >
                    <th
                      colspan="2"
                      rowspan="2"
                      style="
                        border-right: 1px solid white;
                        border-top: 1px solid white;
                      "
                    >
                      手术操作编码
                    </th>
                    <th
                      colspan="3"
                      rowspan="2"
                      style="
                        border-right: 1px solid white;
                        border-top: 1px solid white;
                      "
                    >
                      手术及操作日期
                    </th>
                    <th
                      colspan="2"
                      rowspan="2"
                      style="
                        border-right: 1px solid white;
                        border-top: 1px solid white;
                      "
                    >
                      手术级别
                    </th>
                    <th
                      colspan="5"
                      rowspan="2"
                      style="
                        border-right: 1px solid white;
                        border-top: 1px solid white;
                      "
                    >
                      手术及操作名称
                    </th>
                    <th
                      colspan="6"
                      style="
                        border-right: 1px solid white;
                        border-bottom: 1px solid white;
                      "
                    >
                      手术及操作医师
                    </th>
                    <th
                      colspan="2"
                      rowspan="2"
                      style="border-right: 1px solid white"
                    >
                      切口愈合等级
                    </th>
                    <th
                      colspan="2"
                      rowspan="2"
                      style="
                        border-right: 1px solid white;
                        border-bottom: 1px solid white;
                      "
                    >
                      麻醉方式
                    </th>
                    <th colspan="2" rowspan="2" style="">麻醉医师</th>
                  </tr>
                  <tr
                    style="
                      font-size: 12px;
                      font-weight: bold;
                      text-align: center;
                      border-bottom: 1px solid white;
                    "
                  >
                    <th
                      colspan="2"
                      style="
                        border-right: 1px solid white;
                        border-bottom: 1px solid white;
                      "
                    >
                      术者
                    </th>
                    <th
                      colspan="2"
                      style="
                        border-right: 1px solid white;
                        border-bottom: 1px solid white;
                      "
                    >
                      Ⅰ助
                    </th>
                    <th
                      colspan="2"
                      style="
                        border-right: 1px solid white;
                        border-bottom: 1px solid white;
                      "
                    >
                      Ⅱ助
                    </th>
                  </tr>
                  <tr
                    v-for="item in findByJzlshAndYljgdmList.zybasyssList"
                    :key="item.id"
                    style="
                      font-size: 12px;
                      border-top: 1px solid white;
                      text-align: center;
                      height: 15px;
                    "
                  >
                    <td
                      colspan="2"
                      style="
                        border-right: 1px solid white;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: normal;
                      "
                      id="ssczdm_2"
                    >
                      {{ item.ssczdm }}
                    </td>
                    <td
                      colspan="3"
                      style="border-right: 1px solid white"
                      id="ssrq_2"
                    >
                      {{ item.ssrq | dateFormat }}
                    </td>
                    <td
                      colspan="2"
                      style="border-right: 1px solid white"
                      id="ssdjmc_2"
                    >
                      {{ item.ssdjmc }}
                    </td>
                    <td
                      colspan="5"
                      style="border-right: 1px solid white"
                      id="ssczmc_2"
                    >
                      {{ item.ssczmc }}
                    </td>
                    <td
                      colspan="2"
                      style="border-right: 1px solid white"
                      id="zdysmc_2"
                    >
                      {{ item.zdysmc }}
                    </td>
                    <td
                      colspan="2"
                      style="border-right: 1px solid white"
                      id="dyzsmc_2"
                    ></td>
                    <td
                      colspan="2"
                      style="border-right: 1px solid white"
                      id="dezsmc_2"
                    ></td>
                    <td
                      colspan="2"
                      style="border-right: 1px solid white"
                      id="yhdjmc_2"
                    >
                      {{ item.dyzsmc }}
                    </td>
                    <td
                      colspan="2"
                      style="border-right: 1px solid white"
                      id="mzfsmc_2"
                    >
                      {{ item.mzfsmc }}
                    </td>
                    <td colspan="2" id="mzysmc_2">
                      {{ item.mzysmc }}
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </td>
        </tr>

        <tr style="border-top: 1px solid white">
          <td colspan="24">
            <span
              ><span class="padding-left-5 font-weight-bold"
                >离院方式：{{ findByJzlshAndYljgdmList.lyfsmc }}</span
              ><span id="lyfsmc"></span>，拟接收医疗机构名称：{{
                findByJzlshAndYljgdmList.yzzsqnjsyljgmc
              }}</span
            ><span id="yzzsqnjsyljgmc"></span>
          </td>
        </tr>
        <tr style="border-top: 1px solid white">
          <td colspan="24">
            <span
              ><span class="padding-left-5">是否有出院31天内再住院计划：</span
              ><span id="cyzzybz"></span>，目的:{{
                findByJzlshAndYljgdmList.cyzzymd
              }}</span
            ><span id="cyzzymd"></span>
          </td>
        </tr>
        <tr style="border-top: 1px solid white">
          <td colspan="24">
            <span
              ><span class="padding-left-5">颅脑昏迷时间： 入院前</span
              ><span id="ryqhmsjt">{{ findByJzlshAndYljgdmList.ryqhmsjt }}</span
              >天<span id="ryqhmsjh">
                {{ findByJzlshAndYljgdmList.ryqhmsjh }}</span
              >小时<span id="ryqhmsjm"
                >{{ findByJzlshAndYljgdmList.ryqhmsjm }} </span
              >分钟<span style="padding-left: 20px"
                >入院后<span id="ryhhmsjt">{{
                  findByJzlshAndYljgdmList.ryhhmsjt
                }}</span
                >天<span id="ryhhmsjh">{{
                  findByJzlshAndYljgdmList.ryhhmsjh
                }}</span
                >小时<span id="ryhhmsjm"
                  >{{ findByJzlshAndYljgdmList.ryhhmsjm }} </span
                >分钟</span
              ></span
            >
          </td>
        </tr>
        <tr style="border-top: 1px solid white">
          <td colspan="8">
            <span
              ><span class="padding-left-5 font-weight-bold"
                >住院费用（元）：总费用：{{
                  findByJzlshAndYljgdmList.zyzfy
                }}</span
              ><span id="zyzfy"></span
            ></span>
          </td>
          <td colspan="16">
            <span
              >（<span
                >自付金额：{{ findByJzlshAndYljgdmList.zyzfyzfje
                }}<span id="zyzfyzfje"></span></span
              ><span style="padding-left: 20px"
                >自费金额：{{ findByJzlshAndYljgdmList.zyzfyzfeije
                }}<span id="zyzfyzfeije"></span></span
              ><span style="padding-left: 20px"
                >其他支付：{{ findByJzlshAndYljgdmList.zyzfyqtzhifje
                }}<span id="zyzfyqtzhifje"></span></span
              >）</span
            >
          </td>
        </tr>
        <tr>
          <td colspan="24">
            <span
              ><span class="padding-left-5 font-weight-bold"
                >1.综合医疗服务类：</span
              ><span
                >（1）一般医疗服务费：{{ findByJzlshAndYljgdmList.zhylfwf
                }}<span id="zhylfwf"></span></span
              ><span
                >（2）一般治疗操作费：{{ findByJzlshAndYljgdmList.zhylzlczf
                }}<span id="zhylzlczf"></span></span
              ><span
                >（3）护理费：{{ findByJzlshAndYljgdmList.zhylhlf
                }}<span id="zhylhlf"></span></span
            ></span>
          </td>
        </tr>
        <tr>
          <td colspan="24">
            <span
              ><span class="padding-left-5"
                >（4）其他费用：{{ findByJzlshAndYljgdmList.zhylqtf
                }}<span id="zhylqtf"></span></span
            ></span>
          </td>
        </tr>
        <tr>
          <td colspan="24">
            <span
              ><span class="padding-left-5 font-weight-bold">2.诊断类：</span
              ><span
                >（5）病理诊断费：{{ findByJzlshAndYljgdmList.blzdf
                }}<span id="blzdf">——</span></span
              ><span
                >（6）实验室诊断费：{{ findByJzlshAndYljgdmList.syszdf
                }}<span id="syszdf"></span></span
              ><span
                >（7）影像学诊断费：{{ findByJzlshAndYljgdmList.yxxzdf
                }}<span id="yxxzdf"></span></span
            ></span>
          </td>
        </tr>
        <tr>
          <td colspan="24">
            <span
              ><span class="padding-left-5"
                >（8）临床诊断项目费：{{ findByJzlshAndYljgdmList.lczdf
                }}<span id="lczdf"></span></span
            ></span>
          </td>
        </tr>
        <tr>
          <td colspan="24">
            <span
              ><span class="padding-left-5 font-weight-bold">3.治疗类：</span
              ><span
                >（9）非手术治疗项目费：{{ findByJzlshAndYljgdmList.fsszlxmf
                }}<span id="fsszlxmf"></span></span
              >（<span
                >临床物理治疗费：{{ findByJzlshAndYljgdmList.lcwlzlf
                }}<span id="lcwlzlf"></span></span
              >）</span
            >
          </td>
        </tr>
        <tr>
          <td colspan="24">
            <span
              ><span class="padding-left-5"
                >（10）手术治疗费：{{ findByJzlshAndYljgdmList.sszlf
                }}<span id="sszlf"></span></span
              ><span style="padding-left: 20px"
                >(麻醉费：{{ findByJzlshAndYljgdmList.mzf
                }}<span id="mzf"></span>&nbsp;&nbsp;手术费：{{
                  findByJzlshAndYljgdmList.ssf
                }}<span id="ssf"></span>)</span
              ></span
            >
          </td>
        </tr>
        <tr>
          <td colspan="24">
            <span
              ><span class="padding-left-5 font-weight-bold">4.康复类：</span
              ><span
                >（11）康复费：{{ findByJzlshAndYljgdmList.kff
                }}<span id="kff"></span></span
            ></span>
          </td>
        </tr>
        <tr>
          <td colspan="24">
            <span
              ><span class="padding-left-5 font-weight-bold">5.中医类：</span
              ><span
                >（12）中医治疗费：{{ findByJzlshAndYljgdmList.zyzlf
                }}<span id="zyzlf"></span></span
            ></span>
          </td>
        </tr>
        <tr>
          <td colspan="24">
            <span
              ><span class="padding-left-5 font-weight-bold">6.西药类：</span
              ><span
                >（13）西药费：{{ findByJzlshAndYljgdmList.xyf
                }}<span id="xyf"></span></span
              >（<span
                >抗菌药物费用：{{ findByJzlshAndYljgdmList.kjywf
                }}<span id="kjywf"></span></span
              >）</span
            >
          </td>
        </tr>
        <tr>
          <td colspan="24">
            <span
              ><span class="padding-left-5 font-weight-bold">7.中药类：</span
              ><span
                >（14）中成药费：{{ findByJzlshAndYljgdmList.zchengyf
                }}<span id="zchengyf"></span></span
              ><span
                >（15）中草药费：{{ findByJzlshAndYljgdmList.zcaoyf
                }}<span id="zcaoyf"></span></span
            ></span>
          </td>
        </tr>
        <tr>
          <td colspan="24">
            <span
              ><span class="padding-left-5 font-weight-bold"
                >8.血液和血液制品类：</span
              ><span
                >（16）血费：{{ findByJzlshAndYljgdmList.xf
                }}<span id="xf"></span></span
              ><span
                >（17）白蛋白类制品费：{{ findByJzlshAndYljgdmList.bdblzpf
                }}<span id="bdblzpf"></span></span
              ><span
                >（18）球蛋白类制品费：{{ findByJzlshAndYljgdmList.qdblzpf
                }}<span id="qdblzpf"></span></span
            ></span>
          </td>
        </tr>
        <tr>
          <td colspan="24">
            <span
              ><span class="padding-left-5"
                >（19）凝血因子类制品费：{{ findByJzlshAndYljgdmList.nxyzlzpf
                }}<span id="nxyzlzpf"></span></span
              ><span
                >（20）细胞因子类制品费：{{ findByJzlshAndYljgdmList.xbyzlzpf
                }}<span id="xbyzlzpf"></span></span
            ></span>
          </td>
        </tr>
        <tr>
          <td colspan="24">
            <span
              ><span class="padding-left-5 font-weight-bold">9.耗材类：</span
              ><span
                >（21）检查用一次性医用材料费：{{
                  findByJzlshAndYljgdmList.jcyclf
                }}<span id="jcyclf"></span></span
              ><span
                >（22）治疗用一次性医用材料费：{{
                  findByJzlshAndYljgdmList.zlyclf
                }}<span id="zlyclf"></span></span
            ></span>
          </td>
        </tr>
        <tr>
          <td colspan="24">
            <span
              ><span class="padding-left-5"
                >（23）手术用一次性医用材料费：{{
                  findByJzlshAndYljgdmList.ssyclf
                }}<span id="ssyclf"></span></span
            ></span>
          </td>
        </tr>
        <tr style="border-bottom: 1px solid white">
          <td colspan="24">
            <span
              ><span class="padding-left-5 font-weight-bold">10.其他类：</span
              ><span
                >（24）其他费：{{ findByJzlshAndYljgdmList.qtf
                }}<span id="qtf"></span></span
            ></span>
          </td>
        </tr>
        <!-- 最后渲染的部分 -->
        <tr v-for="item in getHospitalCustomInfo" :key="item.id" v-html="item">
          {{
            item
          }}
        </tr>
      </table>
    </div>
    <div class="empty-container"></div>
  </div>
</template>

<script>
export default {
  props: {
    patientInfo: {
      require: true
    },
    yljgdm: {
      require: true
    }
  },
  data() {
    return {
      findByJzlshAndYljgdmList: {}, //第一个接口数据
      getHospitalCustomInfo: {} //第二个接口数据
      // patientInfoList: {}, //父组件传入的patientInfo的信息
    }
  },
  filters: {
    dateFormat: function(originVal) {
      const dt = new Date(originVal)
      const y = dt.getFullYear()
      const m = (dt.getMonth() + 1 + '').padStart(2, '0')
      const d = (dt.getDate() + '').padStart(2, '0')
      // const hh = (dt.getHours() + '').padStart(2, '0')
      // const mm = (dt.getMinutes() + '').padStart(2, '0')
      // const ss = (dt.getSeconds() + '').padStart(2, '0')
      return `${y}年${m}月${d}日`
    }
  },
  // 侦听传入值的变化
  watch: {
    patientInfo: {
      immediate: true,
      handler(newValue, oldvalue) {
        // console.log(newValue)
        this.getMedicalList(newValue)
      }
    }
  },
  // created() {
  //   调用写在侦听器了，可以检测到传入patientInfo变化
  //   this.getMedicalList()
  // },
  methods: {
    async getMedicalList(patientInfoList) {
      // 侦听器侦听到的变化的数据
      console.log(patientInfoList)
      try {
        let params = {
          jzlsh: patientInfoList.jzlsh,
          yljgdm: patientInfoList.yljgdm
          // 有病案首页的患者数据测试，方便查看数据
          // jzlsh: '1388408',
          // yljgdm: '0002',
        }
        // 第一个接口
        let _res = await this.$api.findByJzlshAndYljgdm(params)
        // 第二个接口
        let _resCustomInfo = await this.$api.getHospitalCustomInfo({
          ...params,
          sysId: _res.data.sysId
        })
        this.findByJzlshAndYljgdmList = Object.assign({}, _res.data)
        this.getHospitalCustomInfo = Object.assign({}, _resCustomInfo.data)
      } catch (error) {
        console.log('该就诊患者无信息', error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/* 病案首页 */
.zybasy {
  overflow: auto !important;
  padding-bottom: 50px !important;
}
.details-body {
  padding: 0px 10px;
}
.zybasy-table {
  width: 100%;
  padding-bottom: 10px;
  border: 1px solid white;
  margin: 0 0 0 0;
  font-size: 11px;
  // max-width: 1000px;
}
.zybasy-table .padding-left-5 {
  padding-left: 5px;
}
.font-weight-bold {
  font-weight: bold;
  font-size: 16px;
  color: white;
}
td {
  color: white;
}
th {
  color: white;
}
table {
  border-collapse: collapse;
}
/* 病案首页 */
</style>
